# Module 7 Submission — Customer Support Ticket System API

**Hands-On Lab: AI for Backend Development**

## Quick Links for Professor

| Deliverable | Location |
|-------------|----------|
| Module overview | [README.md](../README.md) |
| Repository root | [../../README.md](../../README.md) |
| Architecture diagram | [docs/ARCHITECTURE.md](ARCHITECTURE.md) |
| API documentation (Swagger) | http://localhost:5000/api/docs |
| AI prompts used | [docs/AI_PROMPTS.md](AI_PROMPTS.md) |

## Verify the Project

```bash
cd Module-7-AI-Backend-Development
bash scripts/verify-build.sh    # Runs full pytest suite + import check
```

Or step by step:

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export SECRET_KEY=ci-secret-key-minimum-32-characters-long
export JWT_SECRET_KEY=ci-jwt-secret-key-minimum-32-chars
pytest -n auto --dist loadgroup
python run.py                   # http://localhost:5000/health
```

## Test Results Summary

**28 / 28 tests passing** · **90% code coverage** (CI gate: 85%)

| Suite | Tests | File |
|-------|-------|------|
| Authentication | 6 | `tests/test_auth.py` |
| Tickets & workflow | 20 | `tests/test_tickets.py` |
| Utilities | 2 | `tests/test_utils.py` |

## API Highlights

- JWT authentication with token blocklist logout
- Role-based access: Customer, Agent, Admin
- Ticket CRUD, status workflow, comments, attachments
- Auto-assignment, audit history, rate limiting
- OpenAPI docs at `/api/docs`

## CI/CD

Module 7 is integrated into the monorepo pipeline:

- **`.github/workflows/fullstack-ci.yml`** — `test-backend`, `docker-backend`, Bandit SAST
- Docker image builds and passes `/health` check in CI

## Repository Link

> https://github.com/hpoghosyan80/-Cursor_AI_Course/tree/main/Module-7-AI-Backend-Development

## Live Demo

| Service | URL |
|---------|-----|
| Local API | http://localhost:5000 |
| Health check | http://localhost:5000/health |
| Swagger UI | http://localhost:5000/api/docs |

## Status

✅ **Module 7 complete** — all tests pass, CI-integrated, Docker-ready.
