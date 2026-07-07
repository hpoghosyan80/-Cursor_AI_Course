# QA Automation System

Complete quality assurance orchestration with **Page Object Model** E2E tests, unit/integration tests, code quality, security, performance, metrics dashboard, and automated reporting.

## Architecture

```
qa/
├── run-qa.sh / run-all-checks.sh   # Master orchestrators
├── framework/                       # Playwright POM test framework
│   ├── pages/                       # Page Object classes
│   ├── fixtures/                    # Test fixtures (page object injection)
│   ├── specs/                       # E2E test specs
│   └── playwright.config.ts
├── scripts/                         # Individual tool runners + report generators
├── k6/                              # Load test scripts
├── config/qa.config.json
└── reports/                         # Generated output (gitignored)
```

## Page Object Model Framework

| Page Object | Responsibility |
|-------------|----------------|
| `BasePage` | Navigation, localStorage reset |
| `LoginPage` | Login flow |
| `RegisterPage` | User registration |
| `DashboardPage` | Task CRUD, filters, logout |
| `TaskFormModal` | Task creation modal |
| `ProductSearchPage` | Product search, filters, pagination |

Tests use injected fixtures — specs never touch raw selectors directly:

```typescript
test('create task', async ({ registerPage, dashboardPage, uniqueEmail }) => {
  await registerPage.register({ name: 'User', email: uniqueEmail, password: 'pass' })
  await dashboardPage.createTask({ title: 'Task', description: '...', dueDate: '2026-12-31' })
})
```

## Quick Start — Run All Checks

```bash
cd Module-8-AI-QA-DevOps
source venv/bin/activate && pip install -r requirements-qa.txt
npm install
npx playwright install chromium   # first time only

bash qa/run-all-checks.sh
# or: npm run qa:all
```

## Outputs

| File | Description |
|------|-------------|
| `qa/reports/dashboard.html` | Interactive metrics dashboard (Chart.js) |
| `qa/reports/QA_REPORT.html` | Printable comprehensive report |
| `qa/reports/recommendations.md` | AI improvement suggestions |
| `qa/reports/qa-summary.json` | Machine-readable aggregated results |

## Individual Scripts

| Script | Tools |
|--------|-------|
| `run-e2e-pom.sh` | Playwright POM E2E |
| `run-pytest.sh` | pytest (Module 7 + 8) |
| `run-jest-eslint.sh` | Jest + ESLint |
| `run-pylint.sh` | Pylint |
| `run-snyk.sh` | Snyk (npm + Python) |
| `run-zap.sh` | OWASP ZAP DAST |
| `run-k6.sh` | k6 load test |
| `generate_dashboard.py` | Metrics dashboard |
| `generate_report.py` | Full HTML report |
| `generate_recommendations.py` | Improvement recommendations |

## Optional Prerequisites

| Check | Requires |
|-------|----------|
| Playwright POM | Module 6 deps (`npm install` in Module-6) |
| k6 / ZAP | Backend at `http://localhost:5000` |
| Snyk | `SNYK_TOKEN` environment variable |
| ZAP | Docker |

## Configuration

Thresholds and URLs: [`config/qa.config.json`](config/qa.config.json)

## CI

[`.github/workflows/qa-automation.yml`](../../.github/workflows/qa-automation.yml)
