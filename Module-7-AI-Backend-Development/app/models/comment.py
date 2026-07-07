"""Comment model per PRD section 7.2."""

from datetime import datetime, timezone

from app.extensions import db


class Comment(db.Model):
    __tablename__ = "comments"
    __table_args__ = (db.Index("ix_comments_ticket_created", "ticket_id", "created_at"),)

    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(
        db.Integer, db.ForeignKey("tickets.id"), nullable=False, index=True
    )
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    content = db.Column(db.Text, nullable=False)
    is_internal = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    ticket = db.relationship("Ticket", back_populates="comments")
    user = db.relationship("User", back_populates="comments")
    attachments = db.relationship("Attachment", back_populates="comment")
