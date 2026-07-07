# Module 7: Customer Support Ticket System API

Flask REST API implementing PRD core ticket management (FR-001–FR-015): ticket creation, assignment, status workflow, comments, attachments, and role-based access control.

## Tech Stack

Flask 3 · SQLAlchemy · Marshmallow · Flask-JWT-Extended · flask-smorest (Swagger UI) · bcrypt · bleach

## Quick Start

```bash
cd Module-7-AI-Backend-Development
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

export FLASK_APP=run.py
flask db init          # first time only
flask db migrate -m "Support ticket system"
flask db upgrade

flask run
```

- **Swagger UI:** http://localhost:5000/api/docs
- **Health:** http://localhost:5000/health

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
- JWT authentication on all endpoints except `/api/auth/register`
- Rate limiting: 100 requests/minute
- Input sanitization (bleach) and server-side validation
- File upload type/size validation

## Testing

```bash
pytest --cov=app --cov-report=term-missing
```

Coverage threshold: 85% (current: ~90%).

## User Roles

| Role | Permissions |
|------|-------------|
| Customer | Create/view own tickets, add public comments, reopen closed tickets |
| Agent | View assigned + unassigned queue, update status, add comments |
| Admin | Full access, assign tickets, delete tickets |
