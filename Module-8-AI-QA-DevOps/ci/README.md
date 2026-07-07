# Full-Stack CI/CD Pipeline (Optimized)

GitHub Actions workflow for the Cursor AI Course monorepo: **React (Module 6)** + **Flask (Module 7)** + **QA tests (Module 8)**.

## Workflow location

```
.github/workflows/fullstack-ci.yml          ← active (repository root)
Module-8-AI-QA-DevOps/ci/fullstack-ci.yml  ← mirror copy
```

📄 **[AI bottleneck analysis & optimizations →](../docs/ci/PIPELINE_OPTIMIZATION.md)**

## Optimized pipeline stages

```
BUILD (parallel)          SECURITY (parallel)       TEST (parallel)
─────────────────         ───────────────────       ──────────────────────────
build-frontend            security-sast-python      test-frontend [matrix]
build-backend             security-sast-frontend      chromium │ firefox
                          dependency-review (PR)    test-backend (pytest -n auto)
                                                    test-qa (141 tests)
                                                    performance-test (p95 < 500ms)
                              │
                              ▼
                          ci-gate
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
   deploy-green        health-check      promote-production
         │                    │ fail              │
         └────────────────────┴──────▶ rollback ◀─┘
                              │
                              ▼
                    monitoring-summary
```

## Features

| Feature | Implementation |
|---------|----------------|
| **Dependency caching** | npm, pip wheels, Playwright browsers, Vite build cache |
| **Parallel tests** | Browser matrix, `pytest-xdist`, parallel security jobs |
| **SAST** | Bandit (Python high severity gate) |
| **Dependency checks** | pip-audit, npm audit, dependency-review-action |
| **Performance testing** | `scripts/performance-test.py` — p95 < 500ms |
| **Blue-green deploy** | `scripts/blue-green-deploy.sh` — green slot → promote |
| **Automated rollback** | `scripts/rollback.sh` on deploy failure |
| **Monitoring** | `scripts/notify-monitoring.sh` — Datadog, Slack, webhooks |

## Deploy scripts

| Script | Purpose |
|--------|---------|
| `scripts/blue-green-deploy.sh` | Deploy to inactive slot, promote traffic |
| `scripts/health-check.sh` | Post-deploy health validation |
| `scripts/rollback.sh` | Restore previous slot on failure |
| `scripts/notify-monitoring.sh` | Send events to monitoring platforms |
| `scripts/performance-test.py` | API load test with p95 SLA gate |

## GitHub configuration

### Environments
- `green` — pre-production slot
- `github-pages` — production
- `production-rollback` — rollback (optional approval gate)

### Secrets (optional)
| Secret | Purpose |
|--------|---------|
| `DATADOG_API_KEY` | Datadog events |
| `MONITORING_WEBHOOK_URL` | Generic webhook |
| `SLACK_WEBHOOK_URL` | Slack notifications |
| `DEPLOY_API_URL` | Backend deploy |

### Variables (optional)
| Variable | Purpose |
|----------|---------|
| `FRONTEND_PREVIEW_URL` | Green slot health check |
| `BACKEND_STAGING_URL` | API `/health` check |

## Local commands

```bash
# Performance test
cd Module-8-AI-QA-DevOps && python scripts/performance-test.py

# Blue-green deploy (local simulation)
bash scripts/blue-green-deploy.sh deploy production
bash scripts/health-check.sh
bash scripts/blue-green-deploy.sh promote production

# Rollback simulation
bash scripts/rollback.sh "manual test"
```
