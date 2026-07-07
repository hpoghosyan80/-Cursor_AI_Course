"""Ticket API routes (FR-001–FR-015)."""

from flask import request
from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask_smorest import Blueprint

from app.extensions import db
from app.models import (
    Comment,
    HistoryAction,
    Ticket,
    TicketStatus,
    User,
    UserRole,
)
from app.schemas.comment import CommentCreateSchema, CommentSchema
from app.schemas.ticket import (
    AssignTicketSchema,
    AttachmentSchema,
    StatusUpdateSchema,
    TicketCreateSchema,
    TicketHistorySchema,
    TicketListSchema,
    TicketSchema,
    TicketUpdateSchema,
)
from app.services import assignment_service, attachment_service, email_service
from app.services.ticket_service import create_ticket, log_history, update_status
from app.utils.errors import APIError
from app.utils.pagination import get_pagination, paginate_query
from app.utils.permissions import (
    get_current_user,
    get_ticket_or_404,
    require_admin,
    require_agent_or_admin,
    require_ticket_access,
)
from app.utils.security import sanitize_text

blp = Blueprint("tickets", __name__, url_prefix="/api/tickets", description="Tickets")


def _ticket_query_for_user(user: User):
    query = Ticket.query
    if user.role == UserRole.ADMIN:
        return query
    if user.role == UserRole.AGENT:
        return query.filter(
            (Ticket.assigned_to_id == user.id) | (Ticket.assigned_to_id.is_(None))
        )
    return query.filter(
        (Ticket.customer_id == user.id)
        | (Ticket.customer_email == user.email.lower())
    )


@blp.route("/")
class TicketList(MethodView):
    @jwt_required()
    @blp.arguments(TicketCreateSchema, location="json", as_kwargs=True)
    @blp.response(201, TicketSchema)
    def post(self, **data):
        """Create a support ticket (FR-001–FR-004)."""
        user = get_current_user()
        customer_email = data["customer_email"]
        if user.role == UserRole.CUSTOMER:
            customer_email = user.email

        ticket = create_ticket(
            subject=data["subject"],
            description=data["description"],
            priority=data["priority"],
            category=data["category"],
            customer_email=customer_email,
            customer=user if user.role == UserRole.CUSTOMER else None,
        )

        if data.get("auto_assign"):
            assignment_service.auto_assign_ticket(ticket, user)

        return ticket

    @jwt_required()
    @blp.response(200, TicketListSchema)
    def get(self):
        """List tickets visible to the current user."""
        user = get_current_user()
        query = _ticket_query_for_user(user).order_by(Ticket.created_at.desc())

        status = request.args.get("status")
        if status:
            try:
                query = query.filter(Ticket.status == TicketStatus(status))
            except ValueError:
                raise APIError("Invalid status filter", 400, "VALIDATION_ERROR")

        page, per_page = get_pagination()
        result = paginate_query(query, page, per_page)
        return {
            "items": result["items"],
            "pagination": result["pagination"],
        }


@blp.route("/<int:ticket_id>")
class TicketDetail(MethodView):
    @jwt_required()
    @blp.response(200, TicketSchema)
    def get(self, ticket_id):
        """Get ticket details."""
        user = get_current_user()
        ticket = get_ticket_or_404(ticket_id)
        require_ticket_access(user, ticket)
        return ticket

    @jwt_required()
    @blp.arguments(TicketUpdateSchema)
    @blp.response(200, TicketSchema)
    def put(self, data, ticket_id):
        """Update ticket subject/description."""
        user = get_current_user()
        ticket = get_ticket_or_404(ticket_id)
        require_ticket_access(user, ticket)

        if user.role == UserRole.CUSTOMER and ticket.customer_id != user.id:
            raise APIError("Insufficient permissions", 403, "FORBIDDEN")

        if "subject" in data:
            ticket.subject = sanitize_text(data["subject"])
        if "description" in data:
            ticket.description = sanitize_text(data["description"])
        db.session.commit()
        return ticket

    @jwt_required()
    @blp.response(204)
    def delete(self, ticket_id):
        """Delete ticket (admin only)."""
        user = get_current_user()
        require_admin(user)
        ticket = get_ticket_or_404(ticket_id)
        db.session.delete(ticket)
        db.session.commit()
        return ""


@blp.route("/<int:ticket_id>/status")
class TicketStatusUpdate(MethodView):
    @jwt_required()
    @blp.arguments(StatusUpdateSchema)
    @blp.response(200, TicketSchema)
    def put(self, data, ticket_id):
        """Update ticket status (FR-011–FR-014)."""
        user = get_current_user()
        ticket = get_ticket_or_404(ticket_id)
        require_ticket_access(user, ticket)

        if user.role == UserRole.CUSTOMER:
            if data["status"] != TicketStatus.REOPENED:
                raise APIError(
                    "Customers may only reopen closed tickets",
                    403,
                    "FORBIDDEN",
                )
        else:
            require_agent_or_admin(user)

        return update_status(ticket, data["status"], user)


@blp.route("/<int:ticket_id>/assign")
class TicketAssign(MethodView):
    @jwt_required()
    @blp.arguments(AssignTicketSchema)
    @blp.response(200, TicketSchema)
    def post(self, data, ticket_id):
        """Assign or reassign ticket (FR-005, FR-008–FR-010)."""
        user = get_current_user()
        ticket = get_ticket_or_404(ticket_id)

        if data.get("auto_assign"):
            if user.role != UserRole.ADMIN:
                raise APIError("Only admins can trigger auto-assign", 403, "FORBIDDEN")
            result = assignment_service.auto_assign_ticket(ticket, user)
            if result is None:
                raise APIError(
                    "No available agent found for auto-assignment",
                    400,
                    "VALIDATION_ERROR",
                )
            return result

        require_admin(user)
        agent = db.session.get(User, data["assigned_to_id"])
        if agent is None:
            raise APIError("Agent not found", 404, "NOT_FOUND")

        is_reassignment = ticket.assigned_to_id is not None
        return assignment_service.assign_ticket(
            ticket, agent, user, is_reassignment=is_reassignment
        )


@blp.route("/<int:ticket_id>/comments")
class TicketComments(MethodView):
    @jwt_required()
    @blp.response(200, CommentSchema(many=True))
    def get(self, ticket_id):
        """List ticket comments chronologically (FR-015, FR-019)."""
        user = get_current_user()
        ticket = get_ticket_or_404(ticket_id)
        require_ticket_access(user, ticket)

        query = Comment.query.filter_by(ticket_id=ticket.id).order_by(Comment.created_at)
        if user.role == UserRole.CUSTOMER:
            query = query.filter_by(is_internal=False)
        return query.all()

    @jwt_required()
    @blp.arguments(CommentCreateSchema)
    @blp.response(201, CommentSchema)
    def post(self, data, ticket_id):
        """Add a comment to a ticket (FR-015)."""
        user = get_current_user()
        ticket = get_ticket_or_404(ticket_id)
        require_ticket_access(user, ticket)

        is_internal = data.get("is_internal", False)
        if is_internal and user.role == UserRole.CUSTOMER:
            raise APIError(
                "Customers cannot add internal comments",
                403,
                "FORBIDDEN",
            )

        comment = Comment(
            ticket_id=ticket.id,
            user_id=user.id,
            content=sanitize_text(data["content"]),
            is_internal=is_internal,
        )
        db.session.add(comment)
        db.session.flush()
        log_history(
            ticket,
            HistoryAction.COMMENT_ADDED,
            user,
            details=f"Comment #{comment.id}",
        )

        recipients = set()
        if not is_internal:
            recipients.add(ticket.customer_email)
            if ticket.assigned_to:
                recipients.add(ticket.assigned_to.email)
            recipients.discard(user.email)
            email_service.notify_new_comment(
                list(recipients), ticket.ticket_number, user.name
            )

        db.session.commit()
        return comment


@blp.route("/<int:ticket_id>/history")
class TicketHistory(MethodView):
    @jwt_required()
    @blp.response(200, TicketHistorySchema(many=True))
    def get(self, ticket_id):
        """Get ticket audit history (FR-013)."""
        user = get_current_user()
        ticket = get_ticket_or_404(ticket_id)
        require_ticket_access(user, ticket)
        return sorted(ticket.history, key=lambda h: h.created_at)


@blp.route("/<int:ticket_id>/attachments")
class TicketAttachments(MethodView):
    @jwt_required()
    @blp.response(201, AttachmentSchema)
    def post(self, ticket_id):
        """Upload attachment to ticket (FR-001)."""
        user = get_current_user()
        ticket = get_ticket_or_404(ticket_id)
        require_ticket_access(user, ticket)

        if "file" not in request.files:
            raise APIError(
                "No file provided",
                400,
                "VALIDATION_ERROR",
                {"file": ["File is required"]},
            )

        attachment = attachment_service.save_attachment(ticket, request.files["file"])
        db.session.commit()
        return attachment
