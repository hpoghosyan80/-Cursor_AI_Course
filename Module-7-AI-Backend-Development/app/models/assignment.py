"""Assignment history per PRD FR-010 / section 7.4."""

from datetime import datetime, timezone

from app.extensions import db


class Assignment(db.Model):
    __tablename__ = "assignments"

    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(
        db.Integer, db.ForeignKey("tickets.id"), nullable=False, index=True
    )
    assigned_to_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    assigned_by_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    assigned_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    ticket = db.relationship("Ticket", back_populates="assignments")
    assigned_to = db.relationship("User", foreign_keys=[assigned_to_id])
    assigned_by = db.relationship("User", foreign_keys=[assigned_by_id])
