# REST API — Feature Specification

Module 8 Exercise 4: a REST API with **user management**, **product catalog**, and **orders**, used as the system under test for the API test suite.

## Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | No | Obtain Bearer token |
| `POST` | `/api/auth/register` | No | Register customer account |

## Users

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/api/users` | Bearer | Admin | List all users |
| `GET` | `/api/users/:id` | Bearer | Self/Admin | Get user by ID |
| `POST` | `/api/users` | Bearer | Admin | Create user |
| `PUT` | `/api/users/:id` | Bearer | Self/Admin | Update user |
| `DELETE` | `/api/users/:id` | Bearer | Admin | Delete user |

## Products

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/api/products` | No | Public | List products (paginated) |
| `GET` | `/api/products/:id` | No | Public | Get product |
| `POST` | `/api/products` | Bearer | Admin | Create product |
| `PUT` | `/api/products/:id` | Bearer | Admin | Update product |
| `DELETE` | `/api/products/:id` | Bearer | Admin | Delete product |

## Orders

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/api/orders` | Bearer | Self/Admin | List orders |
| `GET` | `/api/orders/:id` | Bearer | Owner/Admin | Get order |
| `POST` | `/api/orders` | Bearer | Customer | Create order |
| `PUT` | `/api/orders/:id` | Bearer | Admin | Update order status |
| `DELETE` | `/api/orders/:id` | Bearer | Owner/Admin | Cancel pending order |

## Roles

| Role | Permissions |
|------|-------------|
| `customer` | CRUD own orders (create, read, cancel pending); read products |
| `admin` | Full users/products/orders access |

## Validation Rules

- **User:** `name` 2–120 chars; valid `email`; `role` in `customer`, `admin`
- **Product:** `name` required; `price` > 0; `stock` ≥ 0
- **Order:** `items` non-empty; each `product_id` exists; `quantity` 1–99

## Error Responses

JSON body: `{"message": "...", "code": "ERROR_CODE"}` optional `field` for validation.

| Code | HTTP |
|------|------|
| `VALIDATION_ERROR` | 422 |
| `UNAUTHORIZED` | 401 |
| `FORBIDDEN` | 403 |
| `NOT_FOUND` | 404 |
| `CONFLICT` | 409 |
| `TOO_MANY_REQUESTS` | 429 |

## Rate Limiting

- Global: 100 requests/minute per token/IP
- Login: 10 attempts/minute

## Performance SLA

- All endpoints respond in **< 500ms** under normal test load (in-memory store)
