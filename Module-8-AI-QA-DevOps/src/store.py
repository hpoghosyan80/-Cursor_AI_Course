"""In-memory user store for the profile management test application."""

from __future__ import annotations

import secrets
from copy import deepcopy
from datetime import datetime, timedelta, timezone

import bcrypt
import bleach

from src.errors import APIError, ValidationError
from src.validators import (
    validate_avatar_url,
    validate_bio,
    validate_email,
    validate_name,
    validate_password,
)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(12)).decode("utf-8")


def _check_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def _sanitize_text(text: str) -> str:
    return bleach.clean(text, tags=[], attributes={}, strip=True)


class ProfileStore:
    """Thread-unsafe in-memory persistence for automated tests."""

    def __init__(self) -> None:
        self.reset()

    def reset(self) -> None:
        self.users: dict[int, dict] = {}
        self.tokens: dict[str, int] = {}
        self.revoked_tokens: set[str] = set()
        self._next_id = 1
        self.register_attempts: list[datetime] = []
        self.password_change_attempts: dict[int, list[datetime]] = {}

    def _public_user(self, user: dict) -> dict:
        data = deepcopy(user)
        data.pop("password_hash", None)
        return data

    def register(self, payload: dict) -> dict:
        self._check_rate_limit(self.register_attempts, 20)
        self.register_attempts.append(_utcnow())

        if "name" not in payload:
            raise ValidationError("Name is required", "name")
        if "email" not in payload:
            raise ValidationError("Email is required", "email")
        if "password" not in payload:
            raise ValidationError("Password is required", "password")

        role = payload.get("role", "customer")
        if role != "customer":
            raise APIError("Only customer self-registration is allowed", 403, "FORBIDDEN")

        if payload.get("is_active") is False:
            pass  # ignored; server default applies

        name = _sanitize_text(validate_name(payload["name"]))
        email = validate_email(payload["email"])
        password = validate_password(payload["password"])

        self._purge_expired_accounts()
        existing = self._find_by_email(email)
        if existing is not None:
            if existing["is_active"]:
                raise APIError("Email already registered", 409, "CONFLICT")
            if existing.get("purge_at") and _utcnow() < datetime.fromisoformat(
                existing["purge_at"]
            ):
                raise APIError("Email already registered", 409, "CONFLICT")
            del self.users[existing["id"]]

        now = _utcnow()
        user = {
            "id": self._next_id,
            "name": name,
            "email": email,
            "password_hash": _hash_password(password),
            "role": "customer",
            "bio": payload.get("bio", ""),
            "avatar_url": payload.get("avatar_url", ""),
            "is_active": True,
            "notification_email": payload.get("notification_email", True),
            "notification_push": payload.get("notification_push", False),
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
            "deleted_at": None,
            "purge_at": None,
        }
        self.users[self._next_id] = user
        self._next_id += 1
        return self._public_user(user)

    def login(self, email: str, password: str) -> dict:
        user = self._find_by_email(email)
        if user is None or not _check_password(password, user["password_hash"]):
            raise APIError("Invalid email or password", 401, "UNAUTHORIZED")
        if not user["is_active"]:
            raise APIError("Account is disabled", 403, "FORBIDDEN")
        token = secrets.token_urlsafe(32)
        self.tokens[token] = user["id"]
        return {"access_token": token, "token_type": "Bearer"}

    def logout(self, token: str) -> dict:
        user_id = self._resolve_token(token)
        self.revoked_tokens.add(token)
        self.tokens.pop(token, None)
        return {"message": "Successfully logged out"}

    def get_profile(self, token: str) -> dict:
        user = self._get_user_from_token(token)
        return self._public_user(user)

    def update_profile(self, token: str, payload: dict) -> dict:
        user = self._get_user_from_token(token)
        if not payload:
            raise APIError("No valid fields to update", 400, "BAD_REQUEST")
        if "role" in payload or "id" in payload or "is_active" in payload:
            raise APIError("Forbidden field in update", 403, "FORBIDDEN")

        updates: dict = {}
        if "name" in payload:
            updates["name"] = _sanitize_text(validate_name(payload["name"]))
        if "email" in payload:
            new_email = validate_email(payload["email"])
            if any(
                u["id"] != user["id"] and u["email"] == new_email
                for u in self.users.values()
            ):
                raise APIError("Email already registered", 409, "CONFLICT")
            updates["email"] = new_email
        if "bio" in payload:
            updates["bio"] = _sanitize_text(validate_bio(payload["bio"]))
        if "avatar_url" in payload:
            updates["avatar_url"] = validate_avatar_url(payload["avatar_url"])
        if "notification_email" in payload:
            updates["notification_email"] = bool(payload["notification_email"])
        if "notification_push" in payload:
            updates["notification_push"] = bool(payload["notification_push"])

        user.update(updates)
        user["updated_at"] = _utcnow().isoformat()
        return self._public_user(user)

    def change_password(self, token: str, payload: dict) -> dict:
        user = self._get_user_from_token(token)
        attempts = self.password_change_attempts.setdefault(user["id"], [])
        self._check_rate_limit(attempts, 5)
        attempts.append(_utcnow())

        current = payload.get("current_password")
        new_password = payload.get("new_password")
        confirm = payload.get("confirm_password")

        if not current:
            raise ValidationError("Current password is required", "current_password")
        if not _check_password(current, user["password_hash"]):
            raise APIError("Invalid current password", 401, "UNAUTHORIZED")
        if new_password != confirm:
            raise ValidationError("Password confirmation does not match", "confirm_password")
        if current == new_password:
            raise APIError("New password must differ from current password", 400, "BAD_REQUEST")

        validated = validate_password(new_password, check_common=True)
        user["password_hash"] = _hash_password(validated)
        user["updated_at"] = _utcnow().isoformat()
        self._invalidate_user_tokens(user["id"])
        return {"message": "Password updated successfully"}

    def delete_account(self, token: str, payload: dict) -> dict:
        user = self._get_user_from_token(token)
        password = payload.get("password")
        confirmation = payload.get("confirmation")

        if not password:
            raise ValidationError("Password is required", "password")
        if confirmation != "DELETE":
            raise ValidationError("Confirmation must be exactly DELETE", "confirmation")
        if not _check_password(password, user["password_hash"]):
            raise APIError("Invalid password", 401, "UNAUTHORIZED")
        if not user["is_active"] and user.get("deleted_at"):
            raise APIError("Account already deleted", 403, "FORBIDDEN")

        now = _utcnow()
        user["is_active"] = False
        user["deleted_at"] = now.isoformat()
        user["purge_at"] = (now + timedelta(days=30)).isoformat()
        user["updated_at"] = now.isoformat()
        self._invalidate_user_tokens(user["id"])
        return {"message": "Account scheduled for deletion"}

    def reactivate(self, email: str, password: str) -> dict:
        user = self._find_by_email(email)
        if user is None:
            raise APIError("User not found", 404, "NOT_FOUND")
        if user["is_active"]:
            raise APIError("Account is already active", 400, "BAD_REQUEST")
        if user.get("purge_at") and _utcnow() >= datetime.fromisoformat(user["purge_at"]):
            raise APIError("Account permanently purged", 410, "GONE")
        if not _check_password(password, user["password_hash"]):
            raise APIError("Invalid email or password", 401, "UNAUTHORIZED")

        user["is_active"] = True
        user["deleted_at"] = None
        user["purge_at"] = None
        user["updated_at"] = _utcnow().isoformat()
        return self._public_user(user)

    def get_user_record(self, user_id: int) -> dict | None:
        user = self.users.get(user_id)
        return deepcopy(user) if user else None

    def _invalidate_user_tokens(self, user_id: int) -> None:
        for token, uid in list(self.tokens.items()):
            if uid == user_id:
                self.revoked_tokens.add(token)
                del self.tokens[token]

    def _check_rate_limit(self, attempts: list[datetime], limit: int) -> None:
        cutoff = _utcnow() - timedelta(minutes=1)
        recent = [t for t in attempts if t >= cutoff]
        attempts[:] = recent
        if len(recent) >= limit:
            raise APIError("Rate limit exceeded", 429, "TOO_MANY_REQUESTS")

    def _purge_expired_accounts(self) -> None:
        now = _utcnow()
        for user_id, user in list(self.users.items()):
            purge_at = user.get("purge_at")
            if purge_at and now >= datetime.fromisoformat(purge_at):
                del self.users[user_id]

    def _find_by_email(self, email: str) -> dict | None:
        normalized = email.lower().strip()
        for user in self.users.values():
            if user["email"] == normalized:
                return user
        return None

    def _resolve_token(self, token: str) -> int:
        if token in self.revoked_tokens or token not in self.tokens:
            raise APIError("Invalid or expired token", 401, "UNAUTHORIZED")
        return self.tokens[token]

    def _get_user_from_token(self, token: str) -> dict:
        user_id = self._resolve_token(token)
        user = self.users.get(user_id)
        if user is None:
            raise APIError("User not found", 404, "NOT_FOUND")
        if not user["is_active"]:
            raise APIError("Account is disabled", 403, "FORBIDDEN")
        return user
