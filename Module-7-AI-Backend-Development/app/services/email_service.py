"""Email notification stubs (FR-003, FR-007, FR-014)."""

from flask import current_app


def send_email(to: str, subject: str, body: str) -> None:
    """Send email notification. Stub logs in development."""
    if current_app.config.get("TESTING"):
        return
    current_app.logger.info("EMAIL to=%s subject=%s body=%s", to, subject, body)


def notify_ticket_created(customer_email: str, ticket_number: str) -> None:
    send_email(
        customer_email,
        f"Support ticket {ticket_number} received",
        f"Your support ticket {ticket_number} has been created and is open.",
    )


def notify_ticket_assigned(agent_email: str, ticket_number: str) -> None:
    send_email(
        agent_email,
        f"Ticket {ticket_number} assigned to you",
        f"You have been assigned support ticket {ticket_number}.",
    )


def notify_status_changed(
    recipients: list[str], ticket_number: str, old_status: str, new_status: str
) -> None:
    for email in recipients:
        send_email(
            email,
            f"Ticket {ticket_number} status updated",
            f"Ticket {ticket_number} changed from {old_status} to {new_status}.",
        )


def notify_new_comment(
    recipients: list[str], ticket_number: str, author_name: str
) -> None:
    for email in recipients:
        send_email(
            email,
            f"New comment on ticket {ticket_number}",
            f"{author_name} added a comment to ticket {ticket_number}.",
        )
