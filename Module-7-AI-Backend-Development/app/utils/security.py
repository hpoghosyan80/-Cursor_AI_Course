"""Security utilities."""

import re

import bcrypt
import bleach
from flask import current_app

_SLUG_PATTERN = re.compile(r"[^a-z0-9]+")


def hash_password(password: str) -> str:
    rounds = current_app.config.get("BCRYPT_ROUNDS", 12)
    salt = bcrypt.gensalt(rounds=rounds)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def check_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def sanitize_text(text: str) -> str:
    return bleach.clean(text, tags=[], attributes={}, strip=True).strip()


def slugify(value: str) -> str:
    slug = value.lower().strip()
    slug = _SLUG_PATTERN.sub("-", slug)
    return slug.strip("-")[:200]
