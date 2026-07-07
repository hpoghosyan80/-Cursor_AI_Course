"""Domain enums per PRD."""

import enum


class UserRole(str, enum.Enum):
    CUSTOMER = "customer"
    AGENT = "agent"
    ADMIN = "admin"


class AvailabilityStatus(str, enum.Enum):
    AVAILABLE = "available"
    BUSY = "busy"
    OFFLINE = "offline"


class TicketStatus(str, enum.Enum):
    OPEN = "open"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    WAITING = "waiting"
    RESOLVED = "resolved"
    CLOSED = "closed"
    REOPENED = "reopened"


class TicketPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class TicketCategory(str, enum.Enum):
    TECHNICAL = "technical"
    BILLING = "billing"
    GENERAL = "general"
    FEATURE_REQUEST = "feature_request"


class HistoryAction(str, enum.Enum):
    CREATED = "created"
    STATUS_CHANGED = "status_changed"
    ASSIGNED = "assigned"
    REASSIGNED = "reassigned"
    COMMENT_ADDED = "comment_added"


STATUS_TRANSITIONS: dict[TicketStatus, set[TicketStatus]] = {
    TicketStatus.OPEN: {TicketStatus.ASSIGNED, TicketStatus.CLOSED},
    TicketStatus.ASSIGNED: {TicketStatus.IN_PROGRESS, TicketStatus.CLOSED},
    TicketStatus.IN_PROGRESS: {
        TicketStatus.WAITING,
        TicketStatus.RESOLVED,
        TicketStatus.CLOSED,
    },
    TicketStatus.WAITING: {TicketStatus.IN_PROGRESS},
    TicketStatus.RESOLVED: {TicketStatus.CLOSED, TicketStatus.REOPENED},
    TicketStatus.CLOSED: {TicketStatus.REOPENED},
    TicketStatus.REOPENED: {TicketStatus.IN_PROGRESS},
}
