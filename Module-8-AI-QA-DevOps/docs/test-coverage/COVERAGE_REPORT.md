# Module 8 — Test Coverage Report

**Generated for:** Final Project Submission  
**Last updated:** July 2026

## Summary

| Suite | Framework | Tests | Status | Report Location |
|-------|-----------|-------|--------|-----------------|
| Profile management API | Python unittest | 88 | ✅ Pass | `tests/positive/`, `negative/`, `edge/`, `security/` |
| REST API | Python unittest | 53 | ✅ Pass | `tests/api/` |
| **Module 8 total** | unittest / pytest | **141** | ✅ Pass | `qa/reports/pytest-module8.json` |
| Backend tickets API | pytest | 28 | ✅ Pass | `qa/reports/pytest-module7.json` |
| Frontend unit | Jest | 4 | ✅ Pass | `qa/reports/jest-results.json` |
| Frontend E2E (POM) | Playwright | 11 | ✅ Pass | `qa/reports/playwright-results.json` |
| **Grand total (automated)** | — | **184** | ✅ Pass | `qa/reports/qa-summary.json` |

## Module 8 — Profile Suite (88 tests)

| Category | Count | Path |
|----------|-------|------|
| Positive | 27 | `tests/positive/` |
| Negative | 34 | `tests/negative/` |
| Edge | 8 | `tests/edge/` |
| Security | 19 | `tests/security/` |

```bash
cd Module-8-AI-QA-DevOps
source venv/bin/activate
python run_profile_tests.py   # 88 tests
```

## Module 8 — REST API Suite (53 tests)

| Area | Count |
|------|-------|
| Users / Products / Orders CRUD | 15 |
| Authentication | 6 |
| Authorization | 6 |
| Validation | 10 |
| Error responses | 8 |
| Rate limiting | 2 |
| Performance (< 500ms) | 6 |

```bash
python run_api_tests.py       # 53 tests
python run_tests.py           # 141 tests (profile + REST)
```

## Module 7 — Backend pytest (28 tests)

| Area | Coverage gate |
|------|---------------|
| Auth, tickets, utils | **90%** line coverage (CI gate: 85%) |

```bash
cd ../Module-7-AI-Backend-Development
source ../Module-8-AI-QA-DevOps/venv/bin/activate
pytest tests/ --cov=app --cov-report=term-missing
```

## Frontend — Jest Unit Tests (4 tests)

| Component | Tests |
|-----------|-------|
| `Button` | render, variants, disabled state |

```bash
cd Module-8-AI-QA-DevOps
npm run test:jest
```

## Frontend — Playwright POM E2E (11 tests)

| Spec | Tests |
|------|-------|
| `auth.spec.ts` | 2 |
| `task-workflow.spec.ts` | 2 |
| `product-search.spec.ts` | 7 |

```bash
npm run test:e2e:pom
# Report: qa/reports/playwright-html/index.html
```

## Code Quality Metrics

| Tool | Target | Latest run |
|------|--------|------------|
| Pylint | ≥ 8.0 / 10 | See `qa/reports/pylint.log` |
| ESLint | 0 errors | See `qa/reports/eslint-results.json` |
| Bandit (CI) | No high severity | `fullstack-ci.yml` |
| pip-audit / npm audit | CI gate | `fullstack-ci.yml` |

## Regenerate Coverage Reports

```bash
cd Module-8-AI-QA-DevOps
source venv/bin/activate
pip install -r requirements-qa.txt
npm install

bash qa/run-all-checks.sh
```

Outputs:
- `qa/reports/qa-summary.json` — aggregated metrics
- `qa/reports/dashboard.html` — visual dashboard
- `qa/reports/QA_REPORT.html` — printable report

## Manual Test Cases (not yet automated)

| Exercise | Manual test cases | Count |
|----------|-------------------|-------|
| User profile | `docs/test-cases/USER_PROFILE_TEST_CASES.md` | 108 |
| E-commerce checkout | `docs/test-cases/ECOMMERCE_CHECKOUT_TEST_CASES.md` | 120 |

← [Back to submission guide](SUBMISSION.md)
