# User Profile Management — Feature Specification

This document defines the **User Profile Management** feature under test in Module 8. It extends the authentication layer from [Module 7](../../Module-7-AI-Backend-Development/README.md) with full profile lifecycle operations.

## Scope

| Area | Description |
|------|-------------|
| User registration | Self-service customer account creation |
| Profile retrieval | View authenticated user profile |
| Profile updates | Update name, email, bio, avatar URL, notification preferences |
| Password change | Change password with current-password verification |
| Account deletion | Soft-delete account with confirmation and data retention policy |

## API Endpoints (Under Test)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | No | Register a new customer account |
| `POST` | `/api/auth/login` | No | Obtain JWT access token |
| `GET` | `/api/auth/me` | Bearer | Get current user profile |
| `PATCH` | `/api/users/me` | Bearer | Update profile fields |
| `PUT` | `/api/users/me/password` | Bearer | Change password |
| `DELETE` | `/api/users/me` | Bearer | Request account deletion |
| `POST` | `/api/users/me/reactivate` | No | Reactivate within 30-day grace period |

## Data Model (Profile Fields)

| Field | Type | Constraints | Editable |
|-------|------|-------------|----------|
| `id` | integer | auto-generated | No |
| `name` | string | 2–120 characters | Yes |
| `email` | string | valid email, unique | Yes |
| `bio` | string | 0–500 characters | Yes |
| `avatar_url` | string | valid HTTPS URL or empty | Yes |
| `role` | enum | `customer`, `agent`, `admin` | No (self-service) |
| `is_active` | boolean | default `true` | No (via deletion flow) |
| `notification_email` | boolean | default `true` | Yes |
| `notification_push` | boolean | default `false` | Yes |
| `created_at` | datetime | UTC | No |
| `updated_at` | datetime | UTC | No |

## Business Rules

1. **Registration** — Only `customer` role allowed for self-registration; email normalized to lowercase.
2. **Password** — Minimum 8 characters; must include at least one uppercase letter, one lowercase letter, and one digit.
3. **Email uniqueness** — Duplicate emails return `409 CONFLICT`.
4. **Profile update** — Users may only update their own profile; `role` and `id` are rejected.
5. **Password change** — Requires correct `current_password`; invalidates all existing JWT tokens.
6. **Account deletion** — Soft delete (`is_active = false`); 30-day grace period before permanent purge; requires `password` confirmation.
7. **Rate limiting** — Register: 20/min; login: 30/min; password change: 5/min per user.

## Response Codes

| Code | Meaning |
|------|---------|
| `200` | Success (GET, PATCH, PUT) |
| `201` | Created (register) |
| `400` | Validation error |
| `401` | Missing/invalid token or wrong password |
| `403` | Forbidden (role escalation, disabled account) |
| `404` | User not found |
| `409` | Email conflict |
| `422` | Unprocessable entity (schema validation) |
| `429` | Rate limit exceeded |

## Related Modules

- **Module 7** — Existing auth endpoints (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`)
- **Module 6** — Frontend profile UI (future integration)
