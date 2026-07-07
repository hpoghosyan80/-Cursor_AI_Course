# Module 6 Submission — TaskFlow Collaboration App

**Hands-On Lab: AI for Frontend Development**

## Quick Links for Professor

| Deliverable | Location |
|-------------|----------|
| Module overview | [README.md](../README.md) |
| Repository root | [../../README.md](../../README.md) |
| Application screenshots | [docs/screenshots/](screenshots/) |
| Playwright test report (Markdown) | [docs/test-report/TEST_REPORT.md](test-report/TEST_REPORT.md) |
| Playwright test report (HTML) | [docs/test-report/html/index.html](test-report/html/index.html) |
| AI prompts used | [docs/AI_PROMPTS.md](AI_PROMPTS.md) |

## Verify the Project

```bash
cd Module-6-AI-Frontend-Development
npm install
npx playwright install chromium
npm run build          # Should complete without errors
npm run test:e2e:ci    # 105 tests, all browsers
npm run dev            # Open http://localhost:5173
```

## Screenshots Included

1. `01-login.png` — Login page
2. `02-register.png` — Registration page
3. `03-user-profile-demo.png` — UserProfile component showcase
4. `04-analytics-dashboard.png` — Analytics dashboard
5. `05-settings-panel.png` — Settings panel with tabs
6. `06-product-search.png` — Product search with filters
7. `07-team-dashboard.png` — Team collaboration dashboard
8. `08-kanban-board.png` — Kanban board with tasks
9. `09-dashboard-dark-mode.png` — Dark mode

## Test Results Summary

**105 / 105 tests passing** across Chromium, Firefox, and Mobile Chrome.

Test suites:
- Task management workflow (4 tests × 3 browsers)
- Accessibility with axe-core (6 tests × 3 browsers)
- Responsive design (5 tests × 3 browsers)
- Error handling (6 tests × 3 browsers)
- Product search (14 tests × 3 browsers)

## Exercises Completed

All 12 course exercises are implemented — see [AI_PROMPTS.md](AI_PROMPTS.md) for the prompt used for each exercise and what was built.
