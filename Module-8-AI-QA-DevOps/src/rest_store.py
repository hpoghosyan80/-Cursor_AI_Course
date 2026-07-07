"""In-memory store for the REST API under test."""

from __future__ import annotations

import secrets
import time
from copy import deepcopy
from datetime import datetime, timedelta, timezone

import bcrypt
import bleach

from src.errors import APIError, ValidationError
from src.rest_validators import (
    utcnow_iso,
    validate_email,
    validate_name,
    validate_order_items,
    validate_product,
    validate_role,
)


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(12)).decode()


def _check_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())


def _sanitize(text: str) -> str:
    return bleach.clean(str(text), tags=[], attributes={}, strip=True)


class RestStore:
    def __init__(self) -> None:
        self.reset()

    def reset(self) -> None:
        self.users: dict[int, dict] = {}
        self.products: dict[str, dict] = {}
        self.orders: dict[str, dict] = {}
        self.tokens: dict[str, int] = {}
        self.revoked_tokens: set[str] = set()
        self._next_user_id = 1
        self._next_product_num = 1
        self.request_log: list[float] = []
        self.login_attempts: list[float] = []
        self._seed_defaults()

    def _seed_defaults(self) -> None:
        admin = self._create_user(
            {"name": "Admin User", "email": "admin@api.test", "role": "admin"},
            "AdminPass1",
        )
        customer = self._create_user(
            {"name": "Customer One", "email": "customer@api.test", "role": "customer"},
            "Customer1",
        )
        self._create_user(
            {"name": "Customer Two", "email": "customer2@api.test", "role": "customer"},
            "Customer2",
        )
        self.create_product(
            {
                "name": "Wireless Mouse",
                "description": "Ergonomic wireless mouse",
                "price": 29.99,
                "stock": 100,
                "category": "electronics",
            }
        )
        self.create_product(
            {
                "name": "USB-C Cable",
                "description": "2m braided cable",
                "price": 12.99,
                "stock": 250,
                "category": "accessories",
            }
        )
        self._admin_id = admin["id"]
        self._customer_id = customer["id"]

    def _create_user(self, data: dict, password: str) -> dict:
        user_id = self._next_user_id
        self._next_user_id += 1
        user = {
            "id": user_id,
            "name": _sanitize(data["name"]),
            "email": data["email"].lower(),
            "password_hash": _hash_password(password),
            "role": data.get("role", "customer"),
            "created_at": utcnow_iso(),
        }
        self.users[user_id] = user
        return self._public_user(user)

    def _public_user(self, user: dict) -> dict:
        data = deepcopy(user)
        data.pop("password_hash", None)
        return data

    def _check_rate_limit(self, bucket: list[float], limit: int, window: int = 60) -> None:
        now = time.time()
        bucket[:] = [t for t in bucket if now - t < window]
        if len(bucket) >= limit:
            raise APIError("Rate limit exceeded", 429, "TOO_MANY_REQUESTS")
        bucket.append(now)

    def record_request(self) -> None:
        self._check_rate_limit(self.request_log, 100)

    def login(self, email: str, password: str) -> dict:
        self._check_rate_limit(self.login_attempts, 10)
        user = self._find_user_by_email(email)
        if user is None or not _check_password(password, user["password_hash"]):
            raise APIError("Invalid email or password", 401, "UNAUTHORIZED")
        token = secrets.token_urlsafe(24)
        self.tokens[token] = user["id"]
        return {"access_token": token, "token_type": "Bearer"}

    def register(self, payload: dict) -> dict:
        if "password" not in payload:
            raise ValidationError("Password is required", "password")
        name = _sanitize(validate_name(payload["name"]))
        email = validate_email(payload["email"])
        role = validate_role(payload.get("role", "customer"))
        if role != "customer":
            raise APIError("Only customer self-registration allowed", 403, "FORBIDDEN")
        if self._find_user_by_email(email):
            raise APIError("Email already registered", 409, "CONFLICT")
        return self._create_user({"name": name, "email": email, "role": role}, payload["password"])

    def resolve_token(self, token: str | None) -> dict:
        if not token or token in self.revoked_tokens or token not in self.tokens:
            raise APIError("Invalid or missing token", 401, "UNAUTHORIZED")
        user = self.users.get(self.tokens[token])
        if user is None:
            raise APIError("User not found", 404, "NOT_FOUND")
        return user

    def list_users(self, actor: dict) -> list[dict]:
        self._require_admin(actor)
        return [self._public_user(u) for u in self.users.values()]

    def get_user(self, user_id: int, actor: dict) -> dict:
        user = self.users.get(user_id)
        if user is None:
            raise APIError("User not found", 404, "NOT_FOUND")
        if actor["id"] != user_id and actor["role"] != "admin":
            raise APIError("Forbidden", 403, "FORBIDDEN")
        return self._public_user(user)

    def create_user(self, payload: dict, actor: dict) -> dict:
        self._require_admin(actor)
        if "password" not in payload:
            raise ValidationError("Password is required", "password")
        if "email" not in payload:
            raise ValidationError("Email is required", "email")
        if "name" not in payload:
            raise ValidationError("Name is required", "name")
        name = _sanitize(validate_name(payload["name"]))
        email = validate_email(payload["email"])
        role = validate_role(payload.get("role", "customer"))
        if self._find_user_by_email(email):
            raise APIError("Email already registered", 409, "CONFLICT")
        return self._create_user({"name": name, "email": email, "role": role}, payload["password"])

    def update_user(self, user_id: int, payload: dict, actor: dict) -> dict:
        user = self.users.get(user_id)
        if user is None:
            raise APIError("User not found", 404, "NOT_FOUND")
        if actor["id"] != user_id and actor["role"] != "admin":
            raise APIError("Forbidden", 403, "FORBIDDEN")
        if "name" in payload:
            user["name"] = _sanitize(validate_name(payload["name"]))
        if "email" in payload:
            email = validate_email(payload["email"])
            other = self._find_user_by_email(email)
            if other and other["id"] != user_id:
                raise APIError("Email already registered", 409, "CONFLICT")
            user["email"] = email
        if "role" in payload and actor["role"] == "admin":
            user["role"] = validate_role(payload["role"])
        return self._public_user(user)

    def delete_user(self, user_id: int, actor: dict) -> dict:
        self._require_admin(actor)
        if user_id not in self.users:
            raise APIError("User not found", 404, "NOT_FOUND")
        if user_id == actor["id"]:
            raise APIError("Cannot delete own account", 400, "BAD_REQUEST")
        del self.users[user_id]
        return {"message": "User deleted"}

    def list_products(self, page: int = 1, per_page: int = 20) -> dict:
        items = list(self.products.values())
        start = (page - 1) * per_page
        end = start + per_page
        return {
            "items": items[start:end],
            "page": page,
            "per_page": per_page,
            "total": len(items),
        }

    def get_product(self, product_id: str) -> dict:
        product = self.products.get(product_id)
        if product is None:
            raise APIError("Product not found", 404, "NOT_FOUND")
        return deepcopy(product)

    def create_product(self, payload: dict, actor: dict | None = None) -> dict:
        if actor is not None:
            self._require_admin(actor)
        data = validate_product(payload)
        product_id = f"PROD-{self._next_product_num:03d}"
        self._next_product_num += 1
        product = {"id": product_id, **data, "created_at": utcnow_iso()}
        self.products[product_id] = product
        return deepcopy(product)

    def update_product(self, product_id: str, payload: dict, actor: dict) -> dict:
        self._require_admin(actor)
        if product_id not in self.products:
            raise APIError("Product not found", 404, "NOT_FOUND")
        current = self.products[product_id]
        merged = {**current, **payload, "id": product_id}
        data = validate_product(merged)
        current.update(data)
        return deepcopy(current)

    def delete_product(self, product_id: str, actor: dict) -> dict:
        self._require_admin(actor)
        if product_id not in self.products:
            raise APIError("Product not found", 404, "NOT_FOUND")
        del self.products[product_id]
        return {"message": "Product deleted"}

    def list_orders(self, actor: dict) -> list[dict]:
        orders = list(self.orders.values())
        if actor["role"] != "admin":
            orders = [o for o in orders if o["user_id"] == actor["id"]]
        return deepcopy(orders)

    def get_order(self, order_id: str, actor: dict) -> dict:
        order = self.orders.get(order_id)
        if order is None:
            raise APIError("Order not found", 404, "NOT_FOUND")
        if actor["role"] != "admin" and order["user_id"] != actor["id"]:
            raise APIError("Forbidden", 403, "FORBIDDEN")
        return deepcopy(order)

    def create_order(self, payload: dict, actor: dict) -> dict:
        items = validate_order_items(payload.get("items", []), self.products)
        subtotal = sum(i["unit_price"] * i["quantity"] for i in items)
        for item in items:
            self.products[item["product_id"]]["stock"] -= item["quantity"]
        order_id = f"ORD-{secrets.token_hex(4).upper()}"
        order = {
            "id": order_id,
            "user_id": actor["id"],
            "status": "pending",
            "items": items,
            "subtotal": round(subtotal, 2),
            "total": round(subtotal * 1.0825, 2),
            "created_at": utcnow_iso(),
        }
        self.orders[order_id] = order
        return deepcopy(order)

    def update_order(self, order_id: str, payload: dict, actor: dict) -> dict:
        self._require_admin(actor)
        order = self.orders.get(order_id)
        if order is None:
            raise APIError("Order not found", 404, "NOT_FOUND")
        status = payload.get("status")
        if status not in ("pending", "paid", "shipped", "cancelled"):
            raise ValidationError("Invalid order status", "status")
        order["status"] = status
        return deepcopy(order)

    def delete_order(self, order_id: str, actor: dict) -> dict:
        order = self.orders.get(order_id)
        if order is None:
            raise APIError("Order not found", 404, "NOT_FOUND")
        if actor["role"] != "admin" and order["user_id"] != actor["id"]:
            raise APIError("Forbidden", 403, "FORBIDDEN")
        if order["status"] != "pending":
            raise APIError("Only pending orders can be cancelled", 400, "BAD_REQUEST")
        for item in order["items"]:
            self.products[item["product_id"]]["stock"] += item["quantity"]
        order["status"] = "cancelled"
        return {"message": "Order cancelled"}

    def _find_user_by_email(self, email: str) -> dict | None:
        normalized = email.lower().strip()
        for user in self.users.values():
            if user["email"] == normalized:
                return user
        return None

    def _require_admin(self, actor: dict) -> None:
        if actor["role"] != "admin":
            raise APIError("Admin access required", 403, "FORBIDDEN")
