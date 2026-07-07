# Module 8 — QA & DevOps Architecture

System architecture for the full-stack QA automation platform spanning Module 6 (frontend), Module 7 (backend), and Module 8 (QA/DevOps).

## High-Level Architecture

```mermaid
flowchart TB
    subgraph Dev["Developer Workflow"]
        DEV[Developer Push / PR]
    end

    subgraph CI["GitHub Actions CI/CD"]
        WF1[fullstack-ci.yml]
        WF2[qa-automation.yml]
        BUILD[Build Stage]
        TEST[Test Stage]
        SEC[Security Stage]
        PERF[Performance Stage]
        DEPLOY[Deploy Stage]
    end

    subgraph M6["Module 6 — Frontend"]
        REACT[React + Vite App]
        PW[Playwright E2E]
        JEST[Jest Unit Tests]
        ESLINT[ESLint]
    end

    subgraph M7["Module 7 — Backend"]
        FLASK[Flask REST API]
        PYTEST[pytest Suite]
        PYLINT[Pylint]
    end

    subgraph M8["Module 8 — QA Automation"]
        POM[Playwright POM Framework]
        UNIT[unittest / pytest — 141 tests]
        ORCH[qa/run-all-checks.sh]
        DASH[Quality Dashboard]
        REPORT[QA Report Generator]
    end

    subgraph SecTools["Security & Performance"]
        SNYK[Snyk]
        ZAP[OWASP ZAP]
        K6[k6 Load Test]
        LH[Lighthouse]
    end

    DEV --> WF1 & WF2
    WF1 --> BUILD --> TEST --> DEPLOY
    WF2 --> TEST --> SEC --> PERF --> DASH

    TEST --> M6 & M7 & M8
    SEC --> SNYK & ZAP
    PERF --> K6 & LH

    ORCH --> POM & UNIT & PYTEST & JEST & ESLINT & PYLINT & SNYK & ZAP & K6
    ORCH --> DASH --> REPORT
```

## QA Automation Framework (Page Object Model)

```mermaid
flowchart LR
    subgraph Specs["Test Specs"]
        AUTH[auth.spec.ts]
        TASK[task-workflow.spec.ts]
        PROD[product-search.spec.ts]
    end

    subgraph Fixtures["Fixtures"]
        FIX[test fixtures]
    end

    subgraph Pages["Page Objects"]
        BASE[BasePage]
        LOGIN[LoginPage]
        REG[RegisterPage]
        DASH[DashboardPage]
        MODAL[TaskFormModal]
        SEARCH[ProductSearchPage]
    end

    subgraph App["Module 6 App"]
        UI[React UI — localhost:5173]
    end

    AUTH & TASK & PROD --> FIX
    FIX --> Pages
    Pages --> UI
    BASE --> LOGIN & REG & DASH & SEARCH
    DASH --> MODAL
```

## CI/CD Pipeline Stages

```mermaid
flowchart LR
    subgraph Fullstack["fullstack-ci.yml"]
        D1[deps-frontend] --> B1[build-frontend]
        D2[deps-backend] --> B2[build-backend]
        B1 & B2 --> T1[test-frontend]
        B1 & B2 --> T2[test-backend]
        B1 & B2 --> T3[test-qa-profile]
        B1 & B2 --> T4[test-qa-api]
        T1 & T2 & T3 & T4 --> DEP[deploy]
    end

    subgraph QA["qa-automation.yml"]
        E2E[Playwright POM]
        PY[pytest + Pylint]
        JS[Jest + ESLint]
        SN[Snyk]
        ZA[OWASP ZAP]
        K6[k6]
        GEN[Dashboard + Report]
        E2E --> PY --> JS --> SN --> ZA --> K6 --> GEN
    end
```

## Test Pyramid

```mermaid
flowchart TB
    E2E["E2E — Playwright POM (11 tests)"]
    INT["Integration — pytest Module 7 (28 tests)"]
    API["API — unittest REST suite (53 tests)"]
    UNIT["Unit — Profile unittest (88) + Jest (4)"]

    UNIT --> API --> INT --> E2E
```

## Report Data Flow

```mermaid
flowchart LR
    TOOLS[pytest · Jest · ESLint · Pylint · Snyk · ZAP · k6 · Playwright]
    JSON[qa/reports/*.json]
    SUM[qa-summary.json]
    DASH[dashboard.html]
    REP[QA_REPORT.html]
    REC[recommendations.md]

    TOOLS --> JSON --> SUM
    SUM --> DASH & REP & REC
```

## Module Integration

| Module | Role | Key Paths |
|--------|------|-----------|
| Module 6 | Frontend under test | `Module-6-AI-Frontend-Development/` |
| Module 7 | Backend API under test | `Module-7-AI-Backend-Development/` |
| Module 8 | QA orchestration & CI | `Module-8-AI-QA-DevOps/` |

## Workflows

| Workflow | File | Purpose |
|----------|------|---------|
| Full-stack CI/CD | [`.github/workflows/fullstack-ci.yml`](../../.github/workflows/fullstack-ci.yml) | Build, test, deploy |
| QA Automation | [`.github/workflows/qa-automation.yml`](../../.github/workflows/qa-automation.yml) | Full QA suite + dashboard |

← [Back to submission guide](SUBMISSION.md)
