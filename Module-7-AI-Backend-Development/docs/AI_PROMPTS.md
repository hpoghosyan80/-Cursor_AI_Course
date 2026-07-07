# Module 7 — AI Prompts Log

Record of AI-assisted development prompts and deliverables.

---

## Exercise: Customer Support Ticket System API

**Prompt:**
> Build a Flask REST API for a customer support ticket system with user authentication (JWT), ticket CRUD, assignment workflow, comments, file attachments, role-based access control, rate limiting, input validation, and Swagger documentation. Include pytest tests with 85% coverage.

**What AI built:**
- Flask application factory with blueprints for auth, tickets, and agents
- SQLAlchemy models: User, Ticket, Comment, Attachment, Assignment, TicketHistory
- Marshmallow schemas with validation and bleach sanitization
- Services: TicketService, AssignmentService, AttachmentService, EmailService
- JWT auth with token blocklist, bcrypt hashing, Flask-Limiter
- OpenAPI docs via flask-smorest at `/api/docs`
- **28 pytest tests** with **90% coverage**
- Dockerfile with health check for CI

**Run:**
```bash
cd Module-7-AI-Backend-Development
bash scripts/verify-build.sh
```

---

## Exercise: CI/CD Integration

**Prompt:**
> Integrate the Flask backend into the full-stack GitHub Actions pipeline with parallel pytest, Docker build verification, and security scanning.

**What AI built:**
- `test-backend` job in `fullstack-ci.yml` with pytest-xdist
- `docker-backend` job with GHA layer cache and `/health` verification
- Bandit + pip-audit in security matrix

---
