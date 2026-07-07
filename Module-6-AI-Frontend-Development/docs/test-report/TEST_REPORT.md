# Playwright E2E Test Report

**Generated:** 2026-07-07  
**Total tests:** 105  
**Passed:** 105  
**Failed:** 0  
**Skipped:** 0  
**Pass rate:** 100%

## Summary

| Suite | Tests |
|-------|-------|
| Task management workflow | User registration, login, task CRUD, logout |
| Accessibility | WCAG checks (axe-core), keyboard navigation, ARIA |
| Responsive design | Mobile, tablet, desktop viewports |
| Error handling | Invalid login, validation errors, empty states |
| Product search | Search, filters, sort, pagination, error states |
| Documentation screenshots | Automated screenshot capture |

## Test Results

| Status | Test | Duration |
|--------|------|----------|
| ✅ passed | accessibility.spec.ts › Accessibility › login page has no critical accessibility violations | 913ms |
| ✅ passed | accessibility.spec.ts › Accessibility › register page has no critical accessibility violations | 983ms |
| ✅ passed | accessibility.spec.ts › Accessibility › dashboard has no critical accessibility violations | 1499ms |
| ✅ passed | accessibility.spec.ts › Accessibility › task form modal is keyboard accessible | 974ms |
| ✅ passed | accessibility.spec.ts › Accessibility › form fields have associated labels | 703ms |
| ✅ passed | accessibility.spec.ts › Accessibility › error messages use role="alert" | 764ms |
| ✅ passed | accessibility.spec.ts › Accessibility › login page has no critical accessibility violations | 1363ms |
| ✅ passed | accessibility.spec.ts › Accessibility › register page has no critical accessibility violations | 2810ms |
| ✅ passed | accessibility.spec.ts › Accessibility › dashboard has no critical accessibility violations | 4378ms |
| ✅ passed | accessibility.spec.ts › Accessibility › task form modal is keyboard accessible | 3652ms |
| ✅ passed | accessibility.spec.ts › Accessibility › form fields have associated labels | 1287ms |
| ✅ passed | accessibility.spec.ts › Accessibility › error messages use role="alert" | 1676ms |
| ✅ passed | accessibility.spec.ts › Accessibility › login page has no critical accessibility violations | 737ms |
| ✅ passed | accessibility.spec.ts › Accessibility › register page has no critical accessibility violations | 780ms |
| ✅ passed | accessibility.spec.ts › Accessibility › dashboard has no critical accessibility violations | 1402ms |
| ✅ passed | accessibility.spec.ts › Accessibility › task form modal is keyboard accessible | 613ms |
| ✅ passed | accessibility.spec.ts › Accessibility › form fields have associated labels | 516ms |
| ✅ passed | accessibility.spec.ts › Accessibility › error messages use role="alert" | 552ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows error for invalid login credentials | 455ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows error when passwords do not match on registration | 513ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows error for password too short on registration | 454ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows error for duplicate email on registration | 667ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows error when creating task with empty title | 657ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows empty state when filter matches no tasks | 594ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows error for invalid login credentials | 1013ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows error when passwords do not match on registration | 1025ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows error for password too short on registration | 1516ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows error for duplicate email on registration | 2203ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows error when creating task with empty title | 1902ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows empty state when filter matches no tasks | 2396ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows error for invalid login credentials | 557ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows error when passwords do not match on registration | 640ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows error for password too short on registration | 519ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows error for duplicate email on registration | 742ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows error when creating task with empty title | 730ms |
| ✅ passed | error-handling.spec.ts › Error handling › shows empty state when filter matches no tasks | 750ms |
| ✅ passed | product-search.spec.ts › Product search › displays all products by default after search | 634ms |
| ✅ passed | product-search.spec.ts › Product search › filters products by search query | 611ms |
| ✅ passed | product-search.spec.ts › Product search › filters products by category | 628ms |
| ✅ passed | product-search.spec.ts › Product search › filters products by price range | 618ms |
| ✅ passed | product-search.spec.ts › Product search › sorts products by price low to high | 603ms |
| ✅ passed | product-search.spec.ts › Product search › sorts products by price high to low | 585ms |
| ✅ passed | product-search.spec.ts › Product search › sorts products by name A–Z | 562ms |
| ✅ passed | product-search.spec.ts › Product search › paginates through results | 664ms |
| ✅ passed | product-search.spec.ts › Product search › combines search, category, and price filters | 616ms |
| ✅ passed | product-search.spec.ts › Product search › reset clears all filters and restores results | 1037ms |
| ✅ passed | product-search.spec.ts › Product search › displays all products by default after search | 1501ms |
| ✅ passed | product-search.spec.ts › Product search › filters products by search query | 1743ms |
| ✅ passed | product-search.spec.ts › Product search › filters products by category | 1649ms |
| ✅ passed | product-search.spec.ts › Product search › filters products by price range | 1381ms |
| ✅ passed | product-search.spec.ts › Product search › sorts products by price low to high | 1315ms |
| ✅ passed | product-search.spec.ts › Product search › sorts products by price high to low | 1339ms |
| ✅ passed | product-search.spec.ts › Product search › sorts products by name A–Z | 1261ms |
| ✅ passed | product-search.spec.ts › Product search › paginates through results | 1612ms |
| ✅ passed | product-search.spec.ts › Product search › combines search, category, and price filters | 1229ms |
| ✅ passed | product-search.spec.ts › Product search › reset clears all filters and restores results | 1455ms |
| ✅ passed | product-search.spec.ts › Product search › displays all products by default after search | 846ms |
| ✅ passed | product-search.spec.ts › Product search › filters products by search query | 868ms |
| ✅ passed | product-search.spec.ts › Product search › filters products by category | 873ms |
| ✅ passed | product-search.spec.ts › Product search › filters products by price range | 642ms |
| ✅ passed | product-search.spec.ts › Product search › sorts products by price low to high | 639ms |
| ✅ passed | product-search.spec.ts › Product search › sorts products by price high to low | 619ms |
| ✅ passed | product-search.spec.ts › Product search › sorts products by name A–Z | 630ms |
| ✅ passed | product-search.spec.ts › Product search › paginates through results | 712ms |
| ✅ passed | product-search.spec.ts › Product search › combines search, category, and price filters | 637ms |
| ✅ passed | product-search.spec.ts › Product search › reset clears all filters and restores results | 1019ms |
| ✅ passed | product-search.spec.ts › Product search — empty and error states › shows empty state when no products match | 594ms |
| ✅ passed | product-search.spec.ts › Product search — empty and error states › shows empty state when price range excludes all products | 574ms |
| ✅ passed | product-search.spec.ts › Product search — empty and error states › shows error state for trigger-error query | 563ms |
| ✅ passed | product-search.spec.ts › Product search — empty and error states › recovers from error state after successful search | 957ms |
| ✅ passed | product-search.spec.ts › Product search — empty and error states › shows empty state when no products match | 1115ms |
| ✅ passed | product-search.spec.ts › Product search — empty and error states › shows empty state when price range excludes all products | 1309ms |
| ✅ passed | product-search.spec.ts › Product search — empty and error states › shows error state for trigger-error query | 1251ms |
| ✅ passed | product-search.spec.ts › Product search — empty and error states › recovers from error state after successful search | 1936ms |
| ✅ passed | product-search.spec.ts › Product search — empty and error states › shows empty state when no products match | 632ms |
| ✅ passed | product-search.spec.ts › Product search — empty and error states › shows empty state when price range excludes all products | 611ms |
| ✅ passed | product-search.spec.ts › Product search — empty and error states › shows error state for trigger-error query | 657ms |
| ✅ passed | product-search.spec.ts › Product search — empty and error states › recovers from error state after successful search | 1027ms |
| ✅ passed | responsive.spec.ts › Responsive design › mobile viewport shows dashboard and task list | 675ms |
| ✅ passed | responsive.spec.ts › Responsive design › mobile sidebar opens via hamburger menu | 603ms |
| ✅ passed | responsive.spec.ts › Responsive design › tablet viewport shows two-column task grid | 474ms |
| ✅ passed | responsive.spec.ts › Responsive design › desktop viewport shows full header with user name | 449ms |
| ✅ passed | responsive.spec.ts › Responsive design › login page is centered on all viewports | 577ms |
| ✅ passed | responsive.spec.ts › Responsive design › mobile viewport shows dashboard and task list | 2365ms |
| ✅ passed | responsive.spec.ts › Responsive design › mobile sidebar opens via hamburger menu | 3139ms |
| ✅ passed | responsive.spec.ts › Responsive design › tablet viewport shows two-column task grid | 2249ms |
| ✅ passed | responsive.spec.ts › Responsive design › desktop viewport shows full header with user name | 1851ms |
| ✅ passed | responsive.spec.ts › Responsive design › login page is centered on all viewports | 2662ms |
| ✅ passed | responsive.spec.ts › Responsive design › mobile viewport shows dashboard and task list | 466ms |
| ✅ passed | responsive.spec.ts › Responsive design › mobile sidebar opens via hamburger menu | 709ms |
| ✅ passed | responsive.spec.ts › Responsive design › tablet viewport shows two-column task grid | 723ms |
| ✅ passed | responsive.spec.ts › Responsive design › desktop viewport shows full header with user name | 747ms |
| ✅ passed | responsive.spec.ts › Responsive design › login page is centered on all viewports | 675ms |
| ✅ passed | task-workflow.spec.ts › Task management workflow › complete user journey: register → create task → complete → delete → logout | 1053ms |
| ✅ passed | task-workflow.spec.ts › Task management workflow › registered user can log in and manage tasks | 1453ms |
| ✅ passed | task-workflow.spec.ts › Task management workflow › redirects unauthenticated users to login | 363ms |
| ✅ passed | task-workflow.spec.ts › Task management workflow › redirects authenticated users away from login | 497ms |
| ✅ passed | task-workflow.spec.ts › Task management workflow › complete user journey: register → create task → complete → delete → logout | 2195ms |
| ✅ passed | task-workflow.spec.ts › Task management workflow › registered user can log in and manage tasks | 1761ms |
| ✅ passed | task-workflow.spec.ts › Task management workflow › redirects unauthenticated users to login | 1020ms |
| ✅ passed | task-workflow.spec.ts › Task management workflow › redirects authenticated users away from login | 1425ms |
| ✅ passed | task-workflow.spec.ts › Task management workflow › complete user journey: register → create task → complete → delete → logout | 947ms |
| ✅ passed | task-workflow.spec.ts › Task management workflow › registered user can log in and manage tasks | 907ms |
| ✅ passed | task-workflow.spec.ts › Task management workflow › redirects unauthenticated users to login | 310ms |
| ✅ passed | task-workflow.spec.ts › Task management workflow › redirects authenticated users away from login | 417ms |

## How to reproduce

```bash
npm install
npx playwright install chromium
npm run test:e2e:ci
```

Open the HTML report:

```bash
open docs/test-report/html/index.html
```
