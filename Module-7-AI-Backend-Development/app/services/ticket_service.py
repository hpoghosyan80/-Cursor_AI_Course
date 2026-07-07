"""Ticket business logic (FR-001–FR-004, FR-011–FR-014)."""

from datetime import datetime, timedelta, timezone

from flask import current_app

from app.extensions import db
from app.models import (
    HistoryAction,
    Ticket,
    TicketHistory,
    TicketStatus,
    User,
)
from app.models.enums import STATUS_TRANSITIONS
from app.services import email_service
from app.utils.errors import APIError
from app.utils.security import sanitize_text


def generate_ticket_number() -> str:
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    prefix = f"TICK-{today}-"
    last = (
        Ticket.query.filter(Ticket.ticket_number.like(f"{prefix}%"))
        .order_by(Ticket.id.desc())
        .first()
    )
    seq = int(last.ticket_number.rsplit("-", 1)[-1]) + 1 if last else 1
    return f"{prefix}{seq:04d}"


def log_history(
    ticket: Ticket,
    action: HistoryAction,
    user: User | None,
    old_value: str | None = None,
    new_value: str | None = None,
    details: str | None = None,
) -> TicketHistory:
    entry = TicketHistory(
        ticket_id=ticket.id,
        user_id=user.id if user else None,
        action=action,
        old_value=old_value,
        new_value=new_value,
        details=details,
    )
    db.session.add(entry)
    return entry


def create_ticket(
    *,
    subject: str,
    description: str,
    priority,
    category,
    customer_email: str,
    customer: User | None = None,
) -> Ticket:
    ticket = Ticket(
        ticket_number=generate_ticket_number(),
        subject=sanitize_text(subject),
        description=sanitize_text(description),
        priority=priority,
        category=category,
        customer_email=customer_email,
        customer_id=customer.id if customer else None,
        status=TicketStatus.OPEN,
    )
    db.session.add(ticket)
    db.session.flush()
    log_history(ticket, HistoryAction.CREATED, customer, new_value=TicketStatus.OPEN.value)
    db.session.commit()
    email_service.notify_ticket_created(customer_email, ticket.ticket_number)
    return ticket


def can_transition(ticket: Ticket, new_status: TicketStatus) -> bool:
    allowed = STATUS_TRANSITIONS.get(ticket.status, set())
    if new_status not in allowed:
        return False
    if (
        ticket.status == TicketStatus.CLOSED
        and new_status == TicketStatus.REOPENED
        and ticket.closed_at
    ):
        window = current_app.config.get("REOPEN_WINDOW_DAYS", 7)
        cutoff = datetime.now(timezone.utc) - timedelta(days=window)
        closed_at = ticket.closed_at
        if closed_at.tzinfo is None:
            closed_at = closed_at.replace(tzinfo=timezone.utc)
        if closed_at < cutoff:
            return False
    return True


def update_status(ticket: Ticket, new_status: TicketStatus, user: User) -> Ticket:
    if not can_transition(ticket, new_status):
        raise APIError(
            f"Cannot transition from '{ticket.status.value}' to '{new_status.value}'",
            400,
            "VALIDATION_ERROR",
            {"status": [f"Invalid status transition to '{new_status.value}'"]},
        )

    old_status = ticket.status.value
    ticket.status = new_status
    now = datetime.now(timezone.utc)

    if new_status == TicketStatus.RESOLVED:
        ticket.resolved_at = now
    elif new_status == TicketStatus.CLOSED:
        ticket.closed_at = now
    elif new_status == TicketStatus.REOPENED:
        ticket.closed_at = None
        ticket.resolved_at = None

    log_history(
        ticket,
        HistoryAction.STATUS_CHANGED,
        user,
        old_value=old_status,
        new_value=new_status.value,
    )

    recipients = {ticket.customer_email}
    if ticket.assigned_to:
        recipients.add(ticket.assigned_to.email)
    email_service.notify_status_changed(
        list(recipients), ticket.ticket_number, old_status, new_status.value
    )
    db.session.commit()
    return ticket
