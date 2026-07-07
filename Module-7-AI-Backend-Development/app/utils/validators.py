"""PRD validation helpers (NFR-013–NFR-016)."""

import re

from marshmallow import ValidationError

_SUBJECT_PATTERN = re.compile(r"^[a-zA-Z0-9\s.,!?'\":;()\-_/]+$")
_EMAIL_PATTERN = re.compile(
    r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@"
    r"[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?"
    r"(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$"
)


def validate_subject(value: str) -> str:
    value = value.strip()
    if len(value) < 5 or len(value) > 200:
        raise ValidationError("Subject must be between 5 and 200 characters.")
    if not _SUBJECT_PATTERN.match(value):
        raise ValidationError(
            "Subject may only contain alphanumeric characters and common punctuation."
        )
    return value


def validate_description(value: str) -> str:
    value = value.strip()
    if len(value) < 20:
        raise ValidationError("Description must be at least 20 characters.")
    if len(value) > 5000:
        raise ValidationError("Description must not exceed 5000 characters.")
    return value


def validate_customer_email(value: str) -> str:
    value = value.strip().lower()
    if not _EMAIL_PATTERN.match(value):
        raise ValidationError("Invalid email format.")
    domain = value.split("@", 1)[1]
    if "." not in domain or len(domain) < 3:
        raise ValidationError("Email must have a valid domain.")
    return value
