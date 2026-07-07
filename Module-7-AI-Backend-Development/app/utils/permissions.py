"""Role-based access control (FR-032–FR-033)."""

from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
from app.models import Ticket, User, UserRole
from app.utils.errors import APIError


@jwt_required()
def get_current_user() -> User:
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if user is None or not user.is_active:
        raise APIError("Authentication required", 401, "UNAUTHORIZED")
    return user


def get_ticket_or_404(ticket_id: int) -> Ticket:
    ticket = db.session.get(Ticket, ticket_id)
    if ticket is None:
        raise APIError("Ticket not found", 404, "NOT_FOUND")
    return ticket


def can_view_ticket(user: User, ticket: Ticket) -> bool:
    if user.role == UserRole.ADMIN:
        return True
    if user.role == UserRole.AGENT:
        return ticket.assigned_to_id == user.id or ticket.assigned_to_id is None
    if user.role == UserRole.CUSTOMER:
        return (
            ticket.customer_id == user.id
            or ticket.customer_email.lower() == user.email.lower()
        )
    return False


def require_ticket_access(user: User, ticket: Ticket) -> None:
    if not can_view_ticket(user, ticket):
        raise APIError("Insufficient permissions", 403, "FORBIDDEN")


def require_admin(user: User) -> None:
    if user.role != UserRole.ADMIN:
        raise APIError("Admin access required", 403, "FORBIDDEN")


def require_agent_or_admin(user: User) -> None:
    if user.role not in (UserRole.AGENT, UserRole.ADMIN):
        raise APIError("Agent or admin access required", 403, "FORBIDDEN")
