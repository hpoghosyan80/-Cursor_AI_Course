# Module 7: Customer Support Ticket System API

Flask REST API implementing customer support ticket management (FR-001–FR-015): ticket creation, assignment, status workflow, comments, attachments, and role-based access control.

## Status

✅ **Complete** — 28 tests passing, 90% coverage, CI-integrated, Docker-ready.

| Deliverable | Link |
|-------------|------|
| Course submission | [docs/SUBMISSION.md](docs/SUBMISSION.md) |
| Architecture | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| AI prompts | [docs/AI_PROMPTS.md](docs/AI_PROMPTS.md) |

## Tech Stack

Flask 3 · SQLAlchemy · Marshmallow · Flask-JWT-Extended · flask-smorest (Swagger UI) · bcrypt · bleach · pytest

## Quick Start

```bash
cd Module-7-AI-Backend-Development
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

export FLASK_APP=run.py
python run.py
```

- **Swagger UI:** http://localhost:5000/api/docs
- **Health:** http://localhost:5000/health

Tables are created automatically on startup (`db.create_all()`).

### Verify build (CI simulation)

```bash
bash scripts/verify-build.sh
```

## Docker

```bash
docker build -t ticket-api .
docker run -p 5000:5000 \
  -e SECRET_KEY=your-secret-key-min-32-chars \
  -e JWT_SECRET_KEY=your-jwt-secret-min-32-chars \
  ticket-api
curl http://localhost:5000/health
```

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register customer account |
| POST | `/api/auth/login` | No | Get JWT token (24h expiry) |
| POST | `/api/auth/logout` | Bearer | Revoke token |
| GET | `/api/auth/me` | Bearer | Current user profile |

### Tickets
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tickets` | Bearer | List tickets (role-filtered) |
| POST | `/api/tickets` | Bearer | Create ticket (FR-001–004) |
| GET | `/api/tickets/:id` | Bearer | Get ticket details |
| PUT | `/api/tickets/:id` | Bearer | Update subject/description |
| DELETE | `/api/tickets/:id` | Admin | Delete ticket |
| PUT | `/api/tickets/:id/status` | Bearer | Update status (FR-011–014) |
| POST | `/api/tickets/:id/assign` | Admin | Assign / auto-assign (FR-005–010) |
| GET/POST | `/api/tickets/:id/comments` | Bearer | Comments (FR-015) |
| GET | `/api/tickets/:id/history` | Bearer | Audit history (FR-013) |
| POST | `/api/tickets/:id/attachments` | Bearer | Upload attachment (FR-001) |

### Agents
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/agents` | Bearer | List agents |
| GET | `/api/agents/:id/tickets` | Bearer | Agent's assigned tickets |
| PUT | `/api/agents/:id/availability` | Agent/Admin | Update availability |

## Security

- bcrypt password hashing (cost factor 12)
- JWT authentication on all endpoints except `/api/auth/register` and `/api/auth/login`
- Rate limiting: 100 requests/minute
- Input sanitization (bleach) and server-side validation
- File upload type/size validation

## Testing

```bash
export SECRET_KEY=ci-secret-key-minimum-32-characters-long
export JWT_SECRET_KEY=ci-jwt-secret-key-minimum-32-chars
pytest -n auto --dist loadgroup --cov=app --cov-report=term-missing
```

| Metric | Value |
|--------|-------|
| Tests | 28 |
| Coverage | ~90% |
| CI gate | 85% minimum |

## User Roles

| Role | Permissions |
|------|-------------|
| Customer | Create/view own tickets, add public comments, reopen closed tickets |
| Agent | View assigned + unassigned queue, update status, add comments |
| Admin | Full access, assign tickets, delete tickets |

## Project Structure

```
Module-7-AI-Backend-Development/
├── README.md
├── requirements.txt
├── run.py
├── Dockerfile
├── docker-entrypoint.sh
├── app/
│   ├── models/
│   ├── schemas/
│   ├── resources/       # API routes (auth, tickets, agents)
│   ├── services/
│   └── utils/
├── tests/
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_tickets.py
│   └── test_utils.py
├── scripts/
│   └── verify-build.sh
└── docs/
    ├── SUBMISSION.md
    ├── ARCHITECTURE.md
    └── AI_PROMPTS.md
```

## Related Modules

| Module | Integration |
|--------|-------------|
| Module 6 | Frontend consumes auth API |
| Module 8 | CI/CD pipeline, QA tests, performance gates |

← [Back to course overview](../README.md)
