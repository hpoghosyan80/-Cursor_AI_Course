"""Agent routes."""

from flask.views import MethodView
from flask_jwt_extended import jwt_required
from flask_smorest import Blueprint

from app.extensions import db
from app.models import AvailabilityStatus, Ticket, User, UserRole
from app.schemas.ticket import TicketSchema
from app.schemas.user import UserSchema
from app.utils.errors import APIError
from app.utils.permissions import get_current_user, require_agent_or_admin

blp = Blueprint("agents", __name__, url_prefix="/api/agents", description="Agents")


@blp.route("/")
class AgentList(MethodView):
    @jwt_required()
    @blp.response(200, UserSchema(many=True))
    def get(self):
        """List support agents."""
        get_current_user()
        return User.query.filter(
            User.role.in_([UserRole.AGENT, UserRole.ADMIN]),
            User.is_active.is_(True),
        ).all()


@blp.route("/<int:agent_id>/tickets")
class AgentTickets(MethodView):
    @jwt_required()
    @blp.response(200, TicketSchema(many=True))
    def get(self, agent_id):
        """Get tickets assigned to an agent."""
        user = get_current_user()
        agent = db.session.get(User, agent_id)
        if agent is None or agent.role not in (UserRole.AGENT, UserRole.ADMIN):
            raise APIError("Agent not found", 404, "NOT_FOUND")

        if user.role == UserRole.AGENT and user.id != agent_id:
            raise APIError("Insufficient permissions", 403, "FORBIDDEN")

        return Ticket.query.filter_by(assigned_to_id=agent_id).order_by(
            Ticket.created_at.desc()
        ).all()


@blp.route("/<int:agent_id>/availability")
class AgentAvailability(MethodView):
    @jwt_required()
    @blp.response(200, UserSchema)
    def put(self, agent_id):
        """Update agent availability status."""
        user = get_current_user()
        if user.role == UserRole.AGENT and user.id != agent_id:
            raise APIError("Insufficient permissions", 403, "FORBIDDEN")
        if user.role == UserRole.CUSTOMER:
            raise APIError("Insufficient permissions", 403, "FORBIDDEN")

        agent = db.session.get(User, agent_id)
        if agent is None or agent.role not in (UserRole.AGENT, UserRole.ADMIN):
            raise APIError("Agent not found", 404, "NOT_FOUND")

        from flask import request

        status_value = request.json.get("availability_status")
        try:
            agent.availability_status = AvailabilityStatus(status_value)
        except (TypeError, ValueError):
            raise APIError(
                "Invalid availability status",
                400,
                "VALIDATION_ERROR",
                {"availability_status": ["Must be available, busy, or offline"]},
            )
        db.session.commit()
        return agent
