"""Input validation aligned with the Module 8 feature specification."""

import re
from urllib.parse import urlparse

from src.errors import ValidationError

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
_PASSWORD_RE = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$")
_INTERNAL_HOSTS = ("169.254.169.254", "127.0.0.1", "localhost", "0.0.0.0")
_COMMON_PASSWORDS = {"password123", "password", "12345678", "qwerty123", "admin123", "letmein1"}


def validate_email(email: str) -> str:
    if not isinstance(email, str):
        raise ValidationError("Invalid email format", "email")
    if not email or not _EMAIL_RE.match(email):
        raise ValidationError("Invalid email format", "email")
    return email.lower().strip()


def validate_password(password: str, *, check_common: bool = False) -> str:
    if not password or len(password) < 8:
        raise ValidationError("Password must be at least 8 characters", "password")
    if not _PASSWORD_RE.match(password):
        raise ValidationError(
            "Password must include uppercase, lowercase, and a digit",
            "password",
        )
    if check_common and password.lower() in _COMMON_PASSWORDS:
        raise ValidationError("Password is too common", "password")
    return password


def validate_name(name: str) -> str:
    if name is None:
        raise ValidationError("Name is required", "name")
    cleaned = name.strip()
    if len(cleaned) < 2 or len(cleaned) > 120:
        raise ValidationError("Name must be between 2 and 120 characters", "name")
    return cleaned


def validate_bio(bio: str | None) -> str:
    if bio is None:
        return ""
    if len(bio) > 500:
        raise ValidationError("Bio must not exceed 500 characters", "bio")
    return bio


def validate_avatar_url(url: str | None) -> str:
    if not url:
        return ""
    parsed = urlparse(url)
    if parsed.scheme != "https" or not parsed.netloc:
        raise ValidationError("Avatar URL must be a valid HTTPS URL", "avatar_url")
    host = parsed.hostname or ""
    if host in _INTERNAL_HOSTS:
        raise ValidationError("Avatar URL must not target internal hosts", "avatar_url")
    if ".." in parsed.path:
        raise ValidationError("Avatar URL path is not allowed", "avatar_url")
    return url
