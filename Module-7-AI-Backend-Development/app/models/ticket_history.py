"""Ticket audit history per PRD FR-013."""

from datetime import datetime, timezone

from app.extensions import db
from app.models.enums import HistoryAction


class TicketHistory(db.Model):
    __tablename__ = "ticket_history"

    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(
        db.Integer, db.ForeignKey("tickets.id"), nullable=False, index=True
    )
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    action = db.Column(db.Enum(HistoryAction), nullable=False)
    old_value = db.Column(db.String(255), nullable=True)
    new_value = db.Column(db.String(255), nullable=True)
    details = db.Column(db.Text, nullable=True)
    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    ticket = db.relationship("Ticket", back_populates="history")
    user = db.relationship("User")
