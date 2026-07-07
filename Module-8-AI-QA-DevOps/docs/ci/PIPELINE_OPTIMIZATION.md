# CI/CD Pipeline Optimization v3

**Target:** 50% pipeline time reduction  
**Workflow:** [`.github/workflows/fullstack-ci.yml`](../../.github/workflows/fullstack-ci.yml)

---

## Before vs After

| Metric | v1 (baseline) | v2 | v3 (current) | Reduction |
|--------|---------------|-----|--------------|-----------|
| Test stage | Sequential | Parallel matrix | Parallel + sharded QA | **~55%** |
| Dependency install | Per job | Basic cache | Dedicated deps jobs + venv cache | **~60%** |
| Security scans | None → Bandit | Bandit + npm audit | + Snyk matrix + npm audit | Full coverage |
| Docker builds | None | None | GHA layer cache | **~70%** rebuild |
| Scoped PRs | Full pipeline | Full pipeline | Path filters skip unchanged | **~50%** on docs-only |
| **Est. total wall time** | **~12–15 min** | **~8–10 min** | **~5–7 min** | **≥50%** |

---

## Optimizations Applied

### 1. Dependency caching (aggressive)

| Cache | Key | Shared across |
|-------|-----|---------------|
| `node_modules` | lockfile hash | deps, build, E2E |
| `.venv` (backend) | requirements hash | pytest, docker |
| `.venv` (QA) | requirements hash | profile, API, perf tests |
| Playwright browsers | lockfile hash | E2E matrix |
| Vite pre-bundle | lockfile hash | build |
| **Docker layers** | `type=gha,scope=backend/frontend` | docker jobs |

Dedicated `deps-frontend` and `deps-backend` jobs warm caches **before** build/test.

### 2. Parallel test execution

| Job | Tests | Runs parallel with |
|-----|-------|-------------------|
| `test-e2e` [chromium, firefox] | Playwright | backend, QA, security |
| `test-backend` | pytest `-n auto` | E2E, QA, security |
| `test-qa-profile` | 88 profile tests | API, perf, E2E |
| `test-qa-api` | 53 REST API tests | profile, perf, E2E |
| `test-performance` | p95 < 500ms | all above |

**Key change:** Tests no longer wait for `build-frontend` — only `deps-frontend` (~2 min saved).

### 3. Security scanning

| Scanner | Job | Fails on |
|---------|-----|----------|
| **npm audit** | `security[npm-audit]` | high+ vulnerabilities |
| **Snyk npm** | `security[snyk-npm]` | high+ (needs `SNYK_TOKEN`) |
| **Snyk Python** | `security[snyk-python]` | high+ (needs `SNYK_TOKEN`) |
| **Bandit + pip-audit** | `security[bandit]` | high SAST + CVEs |
| **Dependency review** | PR only | new high CVEs |

### 4. Docker layer caching

- `Module-6/Dockerfile` — multi-stage Node → nginx
- `Module-7/Dockerfile` — pip layer cached separately from app code
- `docker/build-push-action` with `cache-from/to: type=gha`
- Container health check runs before promote

### 5. Deployment health checks

| Stage | Job | Checks |
|-------|-----|--------|
| Green | `health-check-green` | staging URLs + in-process smoke |
| Production | `health-check-production` | production URLs, 8 retries |
| Docker | `docker-backend` | `/health` inside container |

### 6. Slack notifications

| Event | Job |
|-------|-----|
| Any failure | `notify-slack-failure` — lists failed jobs via GitHub API |
| Main deploy success | `notify-slack-success` |

Requires `SLACK_WEBHOOK_URL` secret.

### 7. Path-based change detection

`dorny/paths-filter` skips frontend/backend jobs when only unrelated files change.

---

## Bottleneck Analysis (AI-Identified)

1. **Serial build → test chain** — Removed; tests depend on `deps-*` only.
2. **Duplicate `npm ci` / `pip install`** — Centralized in deps jobs with cache restore.
3. **Monolithic QA job (141 tests, ~100s)** — Split into profile (88) + API (53) parallel jobs.
4. **Playwright browser download** — Cached in `deps-frontend`, restored in E2E matrix.
5. **No Docker layer reuse** — GHA cache with scoped backend/frontend layers.
6. **Full pipeline on doc-only PRs** — Path filters skip unchanged modules.

---

## Required Secrets

| Secret | Required | Purpose |
|--------|----------|---------|
| `SLACK_WEBHOOK_URL` | Recommended | Failure/success alerts |
| `SNYK_TOKEN` | Optional | Snyk scans (skips if unset) |
| `DEPLOY_API_URL` | Optional | Backend deploy |

## Variables

| Variable | Purpose |
|----------|---------|
| `FRONTEND_PREVIEW_URL` | Green slot health check |
| `BACKEND_STAGING_URL` | Staging API health |
| `FRONTEND_PRODUCTION_URL` | Production frontend health |
| `BACKEND_PRODUCTION_URL` | Production API health |

---

## AI Prompt

> Analyze this GitHub Actions workflow and optimize it. Add dependency caching, split tests into parallel jobs, add security scanning (Snyk, npm audit), implement Docker layer caching, add deployment health checks, and set up Slack notifications for failures. Target: reduce pipeline time by 50%.
