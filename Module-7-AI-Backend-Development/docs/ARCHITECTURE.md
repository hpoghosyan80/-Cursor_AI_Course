# Module 7 — Backend Architecture

Customer Support Ticket System API built with Flask.

## System Overview

```mermaid
flowchart TB
    subgraph Client
        FE[Module 6 React App]
        SW[Swagger UI /api/docs]
    end

    subgraph API["Flask API (Module 7)"]
        AUTH[Auth Blueprint]
        TICKETS[Tickets Blueprint]
        AGENTS[Agents Blueprint]
        JWT[JWT + Rate Limiter]
        VAL[Validators + bleach]
    end

    subgraph Services
        TS[TicketService]
        AS[AssignmentService]
        AT[AttachmentService]
        EM[EmailService]
    end

    subgraph Data
        DB[(SQLite / PostgreSQL)]
        UP[File Uploads]
    end

    FE --> AUTH & TICKETS
    SW --> API
    AUTH & TICKETS & AGENTS --> JWT & VAL
    TICKETS --> TS & AS & AT
    TS & AS & AT & EM --> DB
    AT --> UP
```

## Layer Structure

```
Module-7-AI-Backend-Development/
├── app/
│   ├── __init__.py          # Application factory
│   ├── config.py            # Config classes
│   ├── extensions.py        # db, jwt, ma, limiter, api
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Marshmallow schemas
│   ├── resources/           # API blueprints (routes)
│   ├── services/            # Business logic
│   └── utils/               # Security, permissions, errors
├── tests/                   # pytest suite (28 tests)
├── run.py                   # Entry point
└── Dockerfile               # Production container
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as /api/auth
    participant DB as Database

    C->>A: POST /register
    A->>DB: Create user (bcrypt hash)
    A-->>C: 201 Created

    C->>A: POST /login
    A->>DB: Verify credentials
    A-->>C: JWT access_token (24h)

    C->>A: GET /api/tickets (Bearer token)
    A->>A: Validate JWT + role
    A-->>C: Role-filtered tickets
```

## CI Integration

| Job | Workflow | Command |
|-----|----------|---------|
| `test-backend` | `fullstack-ci.yml` | `pytest -n auto --dist loadgroup` |
| `docker-backend` | `fullstack-ci.yml` | Docker build + `/health` check |
| `security` (bandit) | `fullstack-ci.yml` | Bandit + pip-audit |

← [Back to submission guide](SUBMISSION.md)
