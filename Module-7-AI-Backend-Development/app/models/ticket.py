"""Ticket model per PRD section 7.1."""

from datetime import datetime, timezone

from app.extensions import db
from app.models.enums import TicketCategory, TicketPriority, TicketStatus


class Ticket(db.Model):
    __tablename__ = "tickets"
    __table_args__ = (
        db.Index("ix_tickets_status_priority", "status", "priority"),
        db.Index("ix_tickets_assigned_status", "assigned_to_id", "status"),
    )

    id = db.Column(db.Integer, primary_key=True)
    ticket_number = db.Column(db.String(30), unique=True, nullable=False, index=True)
    subject = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(
        db.Enum(TicketStatus), default=TicketStatus.OPEN, nullable=False, index=True
    )
    priority = db.Column(
        db.Enum(TicketPriority), default=TicketPriority.MEDIUM, nullable=False
    )
    category = db.Column(db.Enum(TicketCategory), nullable=False)
    customer_email = db.Column(db.String(255), nullable=False, index=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    assigned_to_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    resolved_at = db.Column(db.DateTime, nullable=True)
    closed_at = db.Column(db.DateTime, nullable=True)

    customer = db.relationship("User", foreign_keys=[customer_id])
    assigned_to = db.relationship(
        "User", foreign_keys=[assigned_to_id], back_populates="assigned_tickets"
    )
    comments = db.relationship(
        "Comment", back_populates="ticket", cascade="all, delete-orphan"
    )
    attachments = db.relationship(
        "Attachment", back_populates="ticket", cascade="all, delete-orphan"
    )
    assignments = db.relationship(
        "Assignment", back_populates="ticket", cascade="all, delete-orphan"
    )
    history = db.relationship(
        "TicketHistory", back_populates="ticket", cascade="all, delete-orphan"
    )
