# AI Prompts Used — Module 8: QA & DevOps

This document records the prompts used with Cursor AI for each exercise in Module 8.

---

## Exercise 1: User Profile Management Test Cases

**Prompt:**
> Generate comprehensive test cases for a new user profile management feature. Include positive test cases, negative test cases, edge cases, and security test cases. Cover user registration, profile updates, password changes, and account deletion. Use AI to create detailed test scenarios with expected results and test data.

**What AI did:**
- Created a [feature specification](../feature-spec/user-profile-management.md) defining API endpoints, data model, and business rules for the profile management feature (extending Module 7 auth).
- Generated [108 test cases](../test-cases/USER_PROFILE_TEST_CASES.md) across four categories: positive (27), negative (43), edge (18), and security (20).
- Produced structured [test data JSON](../../test-data/user-profile-test-data.json) with valid users, invalid payloads, edge-case inputs, and security payloads for automation.
- Covered all four feature areas: registration, profile retrieval/updates, password change, and account deletion.

**Deliverables:**
| File | Description |
|------|-------------|
| `docs/feature-spec/user-profile-management.md` | Feature scope and API contract |
| `docs/test-cases/USER_PROFILE_TEST_CASES.md` | Full test case catalog |
| `test-data/user-profile-test-data.json` | Reusable test data for manual and automated runs |

---

## Exercise 2: Automated Unittest Scripts

**Prompt:**
> Convert the generated test cases into automated Python unittest scripts with proper test fixtures, mock data, and assertions. Include setup and teardown methods, and organize tests by category.

**What AI did:**
- Built an in-memory Flask profile API (`src/`) implementing the Exercise 1 feature spec for integration testing.
- Created `tests/base.py` with `setUpClass`/`tearDownClass`/`setUp`/`tearDown`, JSON test-data loading, and HTTP helper methods.
- Organized **88 automated tests** into four category folders: `positive/`, `negative/`, `edge/`, `security/`.
- Each test method maps to a manual test-case ID (e.g. `test_REG_P_001_register_valid_customer` → REG-P-001).
- Added `run_tests.py` entry point and `requirements.txt` (Flask, bcrypt, bleach).

**Run:**
```bash
cd Module-8-AI-QA-DevOps
source venv/bin/activate
python run_tests.py
```

---

## Exercise 3: E-Commerce Checkout Test Cases

**Prompt:**
> Generate comprehensive test cases for an e-commerce checkout process. Include test cases for adding items to cart, applying discount codes, payment processing, order confirmation, and email notifications. Cover positive scenarios, negative scenarios, edge cases (empty cart, invalid payment), and security scenarios (payment data validation, SQL injection prevention).

**What AI did:**
- Created a [checkout feature specification](../feature-spec/ecommerce-checkout.md) with API endpoints, data models, business rules, and PCI/security requirements.
- Generated [120 test cases](../test-cases/ECOMMERCE_CHECKOUT_TEST_CASES.md) across five feature areas and four categories.
- Produced [structured test data JSON](../../test-data/ecommerce-checkout-test-data.json) with products, cart payloads, discount codes, payment cards, shipping addresses, and security payloads.

**Deliverables:**
| File | Description |
|------|-------------|
| `docs/feature-spec/ecommerce-checkout.md` | Checkout API contract and business rules |
| `docs/test-cases/ECOMMERCE_CHECKOUT_TEST_CASES.md` | Full test case catalog (120 cases) |
| `test-data/ecommerce-checkout-test-data.json` | Reusable test data for manual and automated runs |

---

## Exercise 4: REST API Test Suite

**Prompt:**
> Generate a comprehensive API test suite for a REST API with endpoints for user management, product catalog, and orders. Include tests for GET, POST, PUT, DELETE operations. Test authentication, authorization, input validation, error responses, rate limiting, and performance (response time under 500ms).

**What AI did:**
- Created a [REST API specification](../feature-spec/rest-api.md) with users, products, and orders endpoints.
- Built an in-memory Flask REST API (`src/rest_app.py`, `src/rest_store.py`) implementing auth, RBAC, validation, and rate limiting.
- Implemented **53 automated tests** in `tests/api/` organized by concern: CRUD per resource, authentication, authorization, validation, errors, rate limiting, and performance.
- Added [REST API test data JSON](../../test-data/rest-api-test-data.json) and updated `run_tests.py` to run both profile and REST suites.

**Run:**
```bash
cd Module-8-AI-QA-DevOps
source venv/bin/activate
python run_tests.py
```

---

## Exercise 5: GitHub Actions CI/CD

**Prompt:**
> Create a basic GitHub Actions workflow for a full-stack application with frontend (React) and backend (Flask). Include build, test, and deploy stages.

**What AI did:**
- Created [`.github/workflows/fullstack-ci.yml`](../../.github/workflows/fullstack-ci.yml) with build, test, and deploy stages.
- **Build:** React lint + Vite build; Flask dependency install + import verification.
- **Test:** Playwright E2E (Chromium), Module 7 pytest with coverage, Module 8 unittest suite (141 tests).
- **Deploy:** Frontend to GitHub Pages; backend placeholder via `scripts/deploy-backend.sh`.
- Added [CI documentation](../ci/README.md) and deploy helper scripts.

---

## Exercise 6: Pipeline Optimization

**Prompt:**
> Optimize an existing CI/CD pipeline for a web application. Add caching for dependencies, parallel test execution, automated security scanning with SAST and dependency checks, performance testing, blue-green deployment strategy, automated rollback on failure, and monitoring integration. Use AI to identify bottlenecks and suggest optimizations.

**What AI did:**
- Analyzed bottlenecks in [PIPELINE_OPTIMIZATION.md](../docs/ci/PIPELINE_OPTIMIZATION.md) (sequential tests, redundant installs, no security/rollback).
- Enhanced workflow with npm/pip/Playwright/Vite caching and parallel browser matrix + pytest-xdist.
- Added Bandit SAST, pip-audit, npm audit, and PR dependency review jobs.
- Added performance-test job (p95 < 500ms) via `scripts/performance-test.py`.
- Implemented blue-green deploy (`blue-green-deploy.sh`), health checks, automated rollback, and monitoring notifications.

---

## Exercise 7: CI/CD v3 — 50% Faster

**Prompt:**
> Analyze this GitHub Actions workflow and optimize it. Add dependency caching, split tests into parallel jobs, add security scanning (Snyk, npm audit), implement Docker layer caching, add deployment health checks, and set up Slack notifications for failures. Target: reduce pipeline time by 50%.

**What AI did:**
- Restructured pipeline: `deps-*` cache warming jobs, path filters, tests parallelized off deps (not build).
- Split QA into `run_profile_tests.py` (88) + `run_api_tests.py` (53) running in parallel.
- Added security matrix: npm audit, Snyk (npm + Python), Bandit/pip-audit.
- Added Dockerfiles with GHA layer caching for frontend and backend.
- Added `notify-slack-failure.sh` with failed-job detection via GitHub API.
- Updated [PIPELINE_OPTIMIZATION.md](../docs/ci/PIPELINE_OPTIMIZATION.md) with v3 before/after analysis.

---

## Exercise 8: Complete QA Automation System

**Prompt:**
> Create a complete QA automation system with test automation framework using Page Object Model, automated code quality checks with ESLint/Pylint, security scanning with OWASP ZAP and Snyk, performance testing with k6, quality dashboard with metrics visualization, and automated report generation. Include scripts to run all checks.

**What AI did:**
- Built Playwright **Page Object Model** framework in `qa/framework/` with `BasePage`, `LoginPage`, `RegisterPage`, `DashboardPage`, `ProductSearchPage`, fixtures, and 11 E2E specs.
- Master orchestrators: `qa/run-qa.sh` and `qa/run-all-checks.sh`.
- Integrated pytest, Jest, ESLint, Pylint, Snyk, OWASP ZAP, and k6 with JSON report output.
- Enhanced dashboard with **Chart.js** metrics visualization (test results, Lighthouse, security, Pylint).
- Added `generate_report.py` for printable `QA_REPORT.html` and AI recommendations engine.

**Run:**
```bash
cd Module-8-AI-QA-DevOps
pip install -r requirements-qa.txt && npm install
npx playwright install chromium
bash qa/run-all-checks.sh
```

---

## Exercise 9: Final Project Submission

**Prompt:**
> Include final project submission materials for Module 8: GitHub repo link, live demo URL, README setup instructions, architecture diagram, test coverage report, CI/CD screenshot, quality dashboard screenshot, and 5–10 minute demo video.

**What AI did:**
- Created [docs/SUBMISSION.md](SUBMISSION.md) — professor-facing checklist with all 8 deliverables.
- Added [docs/ARCHITECTURE.md](ARCHITECTURE.md) — Mermaid diagrams (system, POM, CI/CD, test pyramid).
- Added [docs/test-coverage/COVERAGE_REPORT.md](test-coverage/COVERAGE_REPORT.md) — 184 automated tests summary.
- Created [docs/submission/](submission/) — folders for CI/CD screenshot, dashboard screenshot, and demo video.

---
