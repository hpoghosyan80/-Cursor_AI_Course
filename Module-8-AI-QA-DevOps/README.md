# Module 8: Hands-On Lab — AI for QA & DevOps

This folder contains all work for **Module 8** of the Cursor AI Course: test planning, CI/CD pipelines, automated test orchestration, and DevOps automation built with AI-assisted development.

## Final Project Submission

📋 **[Course submission guide →](docs/SUBMISSION.md)** — checklist for the professor (repo link, demo URL, architecture, coverage, screenshots, video)

| Deliverable | Location |
|-------------|----------|
| Setup instructions | [README.md](README.md) (this file) |
| Architecture diagram | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Test coverage report | [docs/test-coverage/COVERAGE_REPORT.md](docs/test-coverage/COVERAGE_REPORT.md) |
| CI/CD & dashboard screenshots | [docs/submission/screenshots/](docs/submission/screenshots/) |
| Demo video | [docs/submission/demo/](docs/submission/demo/) |
| Quality dashboard (live) | `qa/reports/dashboard.html` (run `bash qa/run-all-checks.sh`) |

## Status

✅ **Exercises 1–8 complete** — ready for final submission (add demo URL, screenshots, and video).

## Exercises

| # | Exercise | Status | Deliverables |
|---|----------|--------|--------------|
| 1 | User profile management test cases | ✅ Complete | [Test cases](docs/test-cases/USER_PROFILE_TEST_CASES.md) · [Test data](test-data/user-profile-test-data.json) |
| 2 | Automated unittest scripts (profile) | ✅ Complete | [tests/](tests/) · [run_tests.py](run_tests.py) |
| 3 | E-commerce checkout test cases | ✅ Complete | [Test cases](docs/test-cases/ECOMMERCE_CHECKOUT_TEST_CASES.md) · [Test data](test-data/ecommerce-checkout-test-data.json) |
| 4 | REST API test suite | ✅ Complete | [tests/api/](tests/api/) · [REST spec](docs/feature-spec/rest-api.md) |
| 5 | GitHub Actions CI/CD | ✅ Complete | [Workflow](ci/fullstack-ci.yml) · [CI docs](ci/README.md) |
| 6 | Pipeline optimization | ✅ Complete | [Optimization analysis](docs/ci/PIPELINE_OPTIMIZATION.md) |
| 7 | CI/CD v3 (50% faster) | ✅ Complete | [Workflow](../.github/workflows/fullstack-ci.yml) · Dockerfiles |
| 8 | Complete QA automation system | ✅ Complete | [qa/](qa/) · [QA workflow](../.github/workflows/qa-automation.yml) |
| 9 | Final project submission | ✅ Complete | [SUBMISSION.md](docs/SUBMISSION.md) · [ARCHITECTURE.md](docs/ARCHITECTURE.md) |

## Exercise 5: GitHub Actions CI/CD

Full-stack pipeline for **React (Module 6)** + **Flask (Module 7)** + **QA tests (Module 8)**.

| Stage | Jobs | Actions |
|-------|------|---------|
| **Build** | `build-frontend`, `build-backend` | `npm ci`, lint, Vite build; pip install, verify Flask app |
| **Test** | `test-frontend`, `test-backend`, `test-qa` | Playwright (Chromium), pytest (85% cov), 141 unittest tests |
| **Deploy** | `deploy` | Frontend → GitHub Pages; backend placeholder script |

**Active workflow:** [`.github/workflows/fullstack-ci.yml`](../.github/workflows/fullstack-ci.yml) (repository root)  
**Module 8 copy:** [`ci/fullstack-ci.yml`](ci/fullstack-ci.yml)  
**Documentation:** [`ci/README.md`](ci/README.md)

Triggers on push/PR to `main`. Deploy runs only on `main` push after all tests pass.

## Exercise 6: Pipeline Optimization

AI-analyzed bottlenecks and optimized the CI/CD pipeline.

| Optimization | Implementation |
|--------------|----------------|
| Caching | npm, pip wheels, Playwright browsers, Vite |
| Parallel tests | Browser matrix (Chromium + Firefox), `pytest -n auto` |
| SAST | Bandit (Python), fail on high severity |
| Dependency checks | pip-audit, npm audit, dependency-review-action |
| Performance gate | p95 < 500ms (`scripts/performance-test.py`) |
| Blue-green deploy | `blue-green-deploy.sh` → health check → promote |
| Automated rollback | `rollback.sh` on deploy failure |
| Monitoring | Datadog / Slack / webhook via `notify-monitoring.sh` |

📄 [AI bottleneck analysis →](docs/ci/PIPELINE_OPTIMIZATION.md)

## Exercise 7: CI/CD v3 — 50% Faster Pipeline

| Optimization | Details |
|--------------|---------|
| `deps-*` jobs | Warm `node_modules` + `.venv` caches before build/test |
| Path filters | Skip unchanged modules on scoped PRs |
| Parallel QA | `run_profile_tests.py` (88) ∥ `run_api_tests.py` (53) |
| Security matrix | Snyk npm/Python, npm audit, Bandit, pip-audit |
| Docker GHA cache | `Module-6/Dockerfile`, `Module-7/Dockerfile` |
| Slack on failure | `notify-slack-failure.sh` + GitHub API job listing |
| Health checks | Green slot + production with 8 retries |

**Est. wall time:** ~5–7 min (down from ~12–15 min)

## Exercise 8: Complete QA Automation System

Unified quality orchestration with **Page Object Model** E2E framework, pytest/Jest, ESLint/Pylint, Snyk/ZAP, k6, metrics dashboard, and automated reporting.

| Layer | Tools | Entry point |
|-------|-------|-------------|
| **E2E (POM)** | Playwright Page Objects | `qa/framework/` · `run-e2e-pom.sh` |
| **Tests** | pytest (Module 7 + 8), Jest (Module 6) | `run-pytest.sh`, `run-jest-eslint.sh` |
| **Code quality** | ESLint, Pylint | `run-jest-eslint.sh`, `run-pylint.sh` |
| **Security** | Snyk, OWASP ZAP | `run-snyk.sh`, `run-zap.sh` |
| **Performance** | k6 | `run-k6.sh` |
| **Reporting** | Dashboard + full report | `generate_dashboard.py`, `generate_report.py` |

```bash
cd Module-8-AI-QA-DevOps
pip install -r requirements-qa.txt && npm install
npx playwright install chromium
bash qa/run-all-checks.sh
open qa/reports/dashboard.html
```

📄 [QA system docs →](qa/README.md) · [POM framework →](qa/framework/pages/)

## Exercise 4: REST API Test Suite

Comprehensive automated API tests for **user management**, **product catalog**, and **orders** covering GET/POST/PUT/DELETE, authentication, authorization, validation, error responses, rate limiting, and performance (< 500ms).

| Module | Tests | Coverage |
|--------|-------|----------|
| Users CRUD | 5 | GET, POST, PUT, DELETE |
| Products CRUD | 5 | GET, POST, PUT, DELETE |
| Orders CRUD | 5 | GET, POST, PUT, DELETE |
| Authentication | 6 | Login, register, token validation |
| Authorization | 6 | Role-based access (customer/admin) |
| Validation | 10 | Input validation, XSS sanitization |
| Error responses | 8 | 400, 401, 403, 404, 409, 422 |
| Rate limiting | 2 | Login + global limits |
| Performance | 6 | Response time < 500ms |
| **REST API total** | **53** | |
| Profile suite (Ex. 2) | **88** | |
| **Grand total** | **141** | Profile (88) + REST API (53) |

```bash
cd Module-8-AI-QA-DevOps
source venv/bin/activate
python run_tests.py          # runs profile + REST API suites
python -m unittest discover -s tests/api -p 'test_*.py' -v  # REST API only
```

📄 [REST API spec →](docs/feature-spec/rest-api.md)  
📄 [REST API test data →](test-data/rest-api-test-data.json)

## Exercise 3: E-Commerce Checkout Test Cases

AI-generated test plan for the full **checkout flow**: cart management, discount codes, payment, order confirmation, and email notifications.

| Category | Cart | Discount | Payment | Order | Email | **Total** |
|----------|------|----------|---------|-------|-------|-----------|
| Positive | 10 | 7 | 7 | 7 | 7 | **38** |
| Negative | 10 | 9 | 10 | 5 | 5 | **39** |
| Edge | 6 | 4 | 5 | 3 | 3 | **21** |
| Security | 4 | 3 | 8 | 3 | 4 | **22** |
| **Total** | **30** | **23** | **30** | **18** | **19** | **120** |

📄 [Checkout test cases →](docs/test-cases/ECOMMERCE_CHECKOUT_TEST_CASES.md)  
📄 [Checkout test data (JSON) →](test-data/ecommerce-checkout-test-data.json)  
📄 [Checkout feature spec →](docs/feature-spec/ecommerce-checkout.md)

## Exercise 2: Automated Unittest Suite (Profile)

Python `unittest` scripts organized by **category** (`positive`, `negative`, `edge`, `security`), with shared fixtures, mock test data from JSON, and `setUp`/`tearDown` lifecycle hooks.

| Category | Tests | Modules |
|----------|-------|---------|
| Positive | 27 | registration, profile, password, deletion |
| Negative | 34 | registration, profile, password, deletion |
| Edge | 8 | registration, profile, password, deletion |
| Security | 19 | registration, profile, password, deletion |
| **Total automated** | **88** | Mapped to test-case IDs (e.g. `REG-P-001`) |

### Run tests

```bash
cd Module-8-AI-QA-DevOps
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run_tests.py
```

## Exercise 1: Test Case Generation

AI-generated comprehensive test plan for a **User Profile Management** feature covering registration, profile updates, password changes, and account deletion.

📄 [Full test case document →](docs/test-cases/USER_PROFILE_TEST_CASES.md)  
📄 [Structured test data (JSON) →](test-data/user-profile-test-data.json)  
📄 [Feature specification →](docs/feature-spec/user-profile-management.md)  
📄 [AI prompts used →](docs/AI_PROMPTS.md)

## Folder Structure

```
Module-8-AI-QA-DevOps/
├── README.md
├── requirements.txt
├── requirements-qa.txt           # pylint, pytest-json-report
├── package.json                  # Jest, ESLint, Lighthouse
├── jest.config.js
├── eslint.config.js
├── .pylintrc
├── run_tests.py
├── qa/
│   ├── run-qa.sh / run-all-checks.sh
│   ├── framework/                # Playwright POM (pages, fixtures, specs)
│   ├── scripts/                  # Tool runners + report generators
│   ├── k6/api-load-test.js
│   ├── tests/jest/               # Jest unit tests (Module 6)
│   └── reports/                  # Generated (gitignored)
├── src/
│   ├── app.py                    # Profile API
│   ├── store.py
│   ├── validators.py
│   ├── errors.py
│   ├── rest_app.py               # REST API under test
│   ├── rest_store.py
│   └── rest_validators.py
├── tests/
│   ├── base.py                   # Profile test fixtures
│   ├── positive/ negative/ edge/ security/
│   └── api/                      # REST API test suite
│       ├── base.py
│       ├── test_users_crud.py
│       ├── test_products_crud.py
│       ├── test_orders_crud.py
│       ├── test_authentication.py
│       ├── test_authorization.py
│       ├── test_validation.py
│       ├── test_error_responses.py
│       ├── test_rate_limiting.py
│       └── test_performance.py
├── ci/
│   ├── README.md
│   └── fullstack-ci.yml          # Mirror of .github/workflows/
├── scripts/
│   ├── deploy-frontend.sh
│   └── deploy-backend.sh
├── test-data/
│   ├── user-profile-test-data.json
│   ├── ecommerce-checkout-test-data.json
│   └── rest-api-test-data.json
└── docs/
    ├── SUBMISSION.md             # Final project submission checklist
    ├── ARCHITECTURE.md           # Architecture diagrams
    ├── AI_PROMPTS.md
    ├── submission/               # Screenshots + demo video
    ├── test-coverage/
    │   └── COVERAGE_REPORT.md
    ├── feature-spec/
    │   ├── user-profile-management.md
    │   └── ecommerce-checkout.md
    └── test-cases/
        ├── USER_PROFILE_TEST_CASES.md
        └── ECOMMERCE_CHECKOUT_TEST_CASES.md
```

## Related Modules

| Module | Folder | Integration |
|--------|--------|-------------|
| Module 6 | [Module-6-AI-Frontend-Development](../Module-6-AI-Frontend-Development/) | Frontend profile UI & Playwright E2E |
| Module 7 | [Module-7-AI-Backend-Development](../Module-7-AI-Backend-Development/) | Auth API (`/api/auth/register`, `/api/auth/me`) |
| Module 8 | **This folder** | QA test plans, CI/CD, DevOps |

## Repository Root

← [Back to course overview](../README.md)
