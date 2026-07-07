"""Ticket assignment logic (FR-005–FR-010)."""

from app.extensions import db
from app.models import (
    Assignment,
    AvailabilityStatus,
    HistoryAction,
    Ticket,
    TicketStatus,
    User,
    UserRole,
)
from app.services import email_service
from app.services.ticket_service import log_history
from app.utils.errors import APIError


def _open_ticket_count(agent_id: int) -> int:
    active_statuses = (
        TicketStatus.OPEN,
        TicketStatus.ASSIGNED,
        TicketStatus.IN_PROGRESS,
        TicketStatus.WAITING,
        TicketStatus.REOPENED,
    )
    return Ticket.query.filter(
        Ticket.assigned_to_id == agent_id,
        Ticket.status.in_(active_statuses),
    ).count()


def find_best_agent(category) -> User | None:
    """Auto-assign by workload, category expertise, and availability (FR-006)."""
    agents = User.query.filter(
        User.role == UserRole.AGENT,
        User.is_active.is_(True),
        User.availability_status != AvailabilityStatus.OFFLINE,
    ).all()
    if not agents:
        return None

    experts = [
        a
        for a in agents
        if a.expertise_areas and category.value in a.expertise_areas
    ]
    candidates = experts or agents

    available = [a for a in candidates if a.availability_status == AvailabilityStatus.AVAILABLE]
    pool = available or candidates

    return min(pool, key=lambda a: (_open_ticket_count(a.id), a.id))


def assign_ticket(
    ticket: Ticket,
    agent: User,
    assigned_by: User,
    *,
    is_reassignment: bool = False,
) -> Ticket:
    if agent.role not in (UserRole.AGENT, UserRole.ADMIN):
        raise APIError(
            "Tickets can only be assigned to support agents",
            400,
            "VALIDATION_ERROR",
            {"assigned_to_id": ["User is not a support agent"]},
        )

    action = HistoryAction.REASSIGNED if is_reassignment else HistoryAction.ASSIGNED
    assignment = Assignment(
        ticket_id=ticket.id,
        assigned_to_id=agent.id,
        assigned_by_id=assigned_by.id,
    )
    db.session.add(assignment)

    old_agent = ticket.assigned_to.email if ticket.assigned_to else None
    ticket.assigned_to_id = agent.id
    if ticket.status == TicketStatus.OPEN:
        ticket.status = TicketStatus.ASSIGNED

    log_history(
        ticket,
        action,
        assigned_by,
        old_value=old_agent,
        new_value=agent.email,
    )

    email_service.notify_ticket_assigned(agent.email, ticket.ticket_number)
    db.session.commit()
    return ticket


def auto_assign_ticket(ticket: Ticket, assigned_by: User | None = None) -> Ticket | None:
    agent = find_best_agent(ticket.category)
    if agent is None:
        return None
    system_user = assigned_by or User.query.filter_by(role=UserRole.ADMIN).first()
    if system_user is None:
        return None
    return assign_ticket(
        ticket,
        agent,
        system_user,
        is_reassignment=ticket.assigned_to_id is not None,
    )
