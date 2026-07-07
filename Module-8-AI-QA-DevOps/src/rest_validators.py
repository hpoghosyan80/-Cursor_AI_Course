"""Validation helpers for the REST API under test."""

import re
from datetime import datetime, timezone

from src.errors import ValidationError

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def validate_email(email: str) -> str:
    if not isinstance(email, str) or not _EMAIL_RE.match(email):
        raise ValidationError("Invalid email format", "email")
    return email.lower().strip()


def validate_name(name: str) -> str:
    if not isinstance(name, str):
        raise ValidationError("Name is required", "name")
    cleaned = name.strip()
    if len(cleaned) < 2 or len(cleaned) > 120:
        raise ValidationError("Name must be between 2 and 120 characters", "name")
    return cleaned


def validate_role(role: str) -> str:
    if role not in ("customer", "admin"):
        raise ValidationError("Invalid role", "role")
    return role


def validate_product(payload: dict) -> dict:
    if "name" not in payload or not str(payload["name"]).strip():
        raise ValidationError("Product name is required", "name")
    price = payload.get("price")
    if not isinstance(price, (int, float)) or price <= 0:
        raise ValidationError("Price must be greater than 0", "price")
    stock = payload.get("stock", 0)
    if not isinstance(stock, int) or stock < 0:
        raise ValidationError("Stock must be a non-negative integer", "stock")
    return {
        "name": str(payload["name"]).strip(),
        "description": str(payload.get("description", "")),
        "price": round(float(price), 2),
        "stock": stock,
        "category": str(payload.get("category", "general")),
    }


def validate_order_items(items: list, products: dict) -> list:
    if not items:
        raise ValidationError("Order must contain at least one item", "items")
    validated = []
    for item in items:
        product_id = item.get("product_id")
        quantity = item.get("quantity")
        if product_id not in products:
            raise ValidationError(f"Product not found: {product_id}", "product_id")
        if not isinstance(quantity, int) or quantity < 1 or quantity > 99:
            raise ValidationError("Quantity must be between 1 and 99", "quantity")
        product = products[product_id]
        if product["stock"] < quantity:
            raise ValidationError("Insufficient stock", "quantity")
        validated.append(
            {
                "product_id": product_id,
                "name": product["name"],
                "quantity": quantity,
                "unit_price": product["price"],
            }
        )
    return validated


def luhn_valid(card_number: str) -> bool:
    digits = [int(c) for c in card_number if c.isdigit()]
    if len(digits) < 13:
        return False
    checksum = 0
    parity = len(digits) % 2
    for i, d in enumerate(digits):
        if i % 2 == parity:
            d *= 2
            if d > 9:
                d -= 9
        checksum += d
    return checksum % 10 == 0


def utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
