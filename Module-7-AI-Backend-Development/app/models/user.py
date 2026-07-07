"""User model per PRD section 7.3."""

from datetime import datetime, timezone

from app.extensions import db
from app.models.enums import AvailabilityStatus, UserRole
from app.utils.security import check_password, hash_password


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.Enum(UserRole), default=UserRole.CUSTOMER, nullable=False)
    availability_status = db.Column(
        db.Enum(AvailabilityStatus),
        default=AvailabilityStatus.OFFLINE,
        nullable=False,
    )
    expertise_areas = db.Column(db.JSON, default=list, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    assigned_tickets = db.relationship(
        "Ticket", foreign_keys="Ticket.assigned_to_id", back_populates="assigned_to"
    )
    comments = db.relationship("Comment", back_populates="user")

    def set_password(self, password: str) -> None:
        self.password_hash = hash_password(password)

    def check_password(self, password: str) -> bool:
        return check_password(password, self.password_hash)

    @property
    def is_admin(self) -> bool:
        return self.role == UserRole.ADMIN

    @property
    def is_agent(self) -> bool:
        return self.role in (UserRole.AGENT, UserRole.ADMIN)
