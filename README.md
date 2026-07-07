# Cursor AI Course — Hands-On Labs

This repository contains three independent modules for the **Cursor AI Course**. Each module is a self-contained project folder with its own code, documentation, and setup instructions.

## Modules

| Module | Folder | Description | Status |
|--------|--------|-------------|--------|
| **Module 6** | [`Module-6-AI-Frontend-Development/`](Module-6-AI-Frontend-Development/) | Hands-On Lab: AI for Frontend Development | ✅ Complete |
| **Module 7** | [`Module-7-AI-Backend-Development/`](Module-7-AI-Backend-Development/) | Hands-On Lab: AI for Backend Development |   ✅ Complete |
| **Module 8** | [`Module-8-AI-QA-DevOps/`](Module-8-AI-QA-DevOps/) | Hands-On Lab: AI for QA & DevOps | ✅ Complete |

---

## Module 6: AI for Frontend Development

A full React + TypeScript + Vite + Tailwind CSS application with UI components, dashboards, Kanban board, and Playwright E2E tests.

**Tech stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Playwright

```bash
cd Module-6-AI-Frontend-Development
npm install
npx playwright install chromium
npm run dev
```

📄 [Full README & setup →](Module-6-AI-Frontend-Development/README.md)  
📄 [Course submission guide →](Module-6-AI-Frontend-Development/docs/SUBMISSION.md)  
📄 [AI prompts used →](Module-6-AI-Frontend-Development/docs/AI_PROMPTS.md)  
📄 [Test report →](Module-6-AI-Frontend-Development/docs/test-report/TEST_REPORT.md)

---

## Module 7: AI for Backend Development

Backend API and server-side logic built with AI assistance. All new backend code for this module lives in this folder.

```bash
cd Module-7-AI-Backend-Development
# Setup instructions will be added as development begins
```

📄 [Module 7 README →](Module-7-AI-Backend-Development/README.md)

---

## Module 8: AI for QA & DevOps

Testing pipelines, CI/CD configuration, QA automation (Page Object Model, quality dashboard), and DevOps automation built with AI assistance.

```bash
cd Module-8-AI-QA-DevOps
python3 -m venv venv && source venv/bin/activate
pip install -r requirements-qa.txt
npm install && npx playwright install chromium
bash qa/run-all-checks.sh
```

📄 [Module 8 README →](Module-8-AI-QA-DevOps/README.md)  
📄 [Course submission guide →](Module-8-AI-QA-DevOps/docs/SUBMISSION.md)  
📄 [Architecture diagram →](Module-8-AI-QA-DevOps/docs/ARCHITECTURE.md)  
📄 [Test coverage report →](Module-8-AI-QA-DevOps/docs/test-coverage/COVERAGE_REPORT.md)  
📄 [AI prompts used →](Module-8-AI-QA-DevOps/docs/AI_PROMPTS.md)

---

## Repository Structure

```
.
├── README.md                              ← You are here
├── Module-6-AI-Frontend-Development/      ← Frontend lab (React app)
│   ├── src/
│   ├── e2e/
│   ├── docs/
│   ├── package.json
│   └── README.md
├── Module-7-AI-Backend-Development/       ← Backend lab (new code)
│   └── README.md
└── Module-8-AI-QA-DevOps/                 ← QA & DevOps lab
    └── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20+ recommended)
- npm 9+
- Git

Each module manages its own dependencies independently.

## License

Educational project — Cursor AI Course.
