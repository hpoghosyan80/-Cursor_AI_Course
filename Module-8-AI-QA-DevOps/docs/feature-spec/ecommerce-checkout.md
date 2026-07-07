# E-Commerce Checkout — Feature Specification

This document defines the **E-Commerce Checkout** feature under test in Module 8. It covers the full purchase flow from cart management through payment, order confirmation, and email notifications.

## Scope

| Area | Description |
|------|-------------|
| Cart management | Add, update, remove items; quantity limits; stock validation |
| Discount codes | Apply/remove promo codes; percentage and fixed discounts |
| Payment processing | Card validation, authorization, capture, refunds |
| Order confirmation | Order summary, receipt, status tracking |
| Email notifications | Order confirmation, payment receipt, shipping updates |

## API Endpoints (Under Test)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/cart` | Session/Bearer | Get current cart |
| `POST` | `/api/cart/items` | Session/Bearer | Add item to cart |
| `PATCH` | `/api/cart/items/:id` | Session/Bearer | Update item quantity |
| `DELETE` | `/api/cart/items/:id` | Session/Bearer | Remove item from cart |
| `POST` | `/api/cart/discount` | Session/Bearer | Apply discount code |
| `DELETE` | `/api/cart/discount` | Session/Bearer | Remove discount code |
| `POST` | `/api/checkout` | Session/Bearer | Initiate checkout (validate cart) |
| `POST` | `/api/checkout/payment` | Session/Bearer | Process payment |
| `GET` | `/api/orders/:id` | Bearer | Get order details |
| `GET` | `/api/orders/:id/confirmation` | Bearer | Get order confirmation receipt |
| `POST` | `/api/orders/:id/resend-email` | Bearer | Resend confirmation email |

## Data Model

### Cart Item

| Field | Type | Constraints |
|-------|------|-------------|
| `product_id` | string | Required; must exist in catalog |
| `quantity` | integer | 1–99 per line item |
| `unit_price` | decimal | Snapshot at add-to-cart time |
| `name` | string | Product display name |

### Discount Code

| Field | Type | Constraints |
|-------|------|-------------|
| `code` | string | 3–20 alphanumeric chars, case-insensitive |
| `type` | enum | `percentage`, `fixed`, `free_shipping` |
| `value` | decimal | 1–50% or fixed amount ≤ $500 |
| `min_order` | decimal | Minimum subtotal to apply |
| `max_uses` | integer | Global usage limit |
| `expires_at` | datetime | UTC expiry |
| `single_use_per_user` | boolean | Default `true` |

### Payment

| Field | Type | Constraints |
|-------|------|-------------|
| `card_number` | string | 13–19 digits; Luhn valid |
| `expiry_month` | integer | 1–12 |
| `expiry_year` | integer | Current year or later |
| `cvv` | string | 3–4 digits |
| `billing_name` | string | 2–120 characters |
| `billing_zip` | string | 5 or 9 digit US ZIP |

### Order

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | `ORD-` + UUID |
| `status` | enum | `pending`, `paid`, `failed`, `refunded` |
| `subtotal` | decimal | Sum of line items |
| `discount` | decimal | Discount amount applied |
| `tax` | decimal | Calculated tax (8.25%) |
| `shipping` | decimal | Flat $5.99 or free |
| `total` | decimal | Final charged amount |
| `confirmation_sent_at` | datetime | Email dispatch timestamp |

## Business Rules

1. **Cart** — Max 50 distinct products; quantity 1–99 per item; out-of-stock items rejected.
2. **Pricing** — `unit_price` locked at add-to-cart; recalculated only if product price changes before checkout (show warning).
3. **Discounts** — One code per cart; cannot stack; expired/invalid codes return `400`; discount cannot exceed subtotal.
4. **Checkout** — Requires non-empty cart, valid shipping address, and accepted terms.
5. **Payment** — PCI: card numbers never stored; only last 4 digits in order record; CVV never persisted.
6. **Order** — Created on successful payment; inventory decremented atomically.
7. **Email** — Confirmation sent within 60 seconds of successful payment; includes order ID, items, total, masked card.

## Response Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created (cart item, order) |
| `400` | Bad request (invalid discount, empty cart) |
| `402` | Payment required / payment failed |
| `404` | Product or order not found |
| `409` | Conflict (insufficient stock) |
| `422` | Validation error |
| `429` | Rate limit exceeded |

## Security Requirements

- Card data validated client-side and server-side; Luhn algorithm enforced
- SQL injection prevention on all string inputs (parameterized queries)
- XSS sanitization on product names and billing fields
- Rate limiting: 10 payment attempts per hour per user
- CVV and full card number excluded from logs and API responses
- HTTPS required for payment endpoints in production

## Related Modules

- **Module 6** — ProductCard component, frontend cart UI
- **Module 7** — User authentication for logged-in checkout
