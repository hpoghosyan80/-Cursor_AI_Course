# AI Prompts Used — Cursor AI Course

This document records the prompts used with Cursor AI to build each exercise in this project. Prompts are listed in the order they were given during development.

---

## Exercise 1: Project Setup

**Prompt:**
> Create a new React project with TypeScript, Vite, and Tailwind CSS configured. Set up the basic folder structure for components.

**What AI did:** Scaffolded a Vite + React + TypeScript project, installed Tailwind CSS v4 with the `@tailwindcss/vite` plugin, configured path aliases (`@/`), and created the `components/ui`, `components/layout`, and `components/common` folder structure with starter components.

---

## Exercise 2: UserProfile Component

**Prompt:**
> Create a comprehensive user profile component for a social media application. Include user avatar, name, bio, stats (followers, following, posts), and action buttons (follow, message, edit profile). Use TypeScript for props and Tailwind CSS for styling. Make it responsive and accessible.

**What AI did:** Built `UserProfile.tsx` with typed props, stat formatting, avatar fallback, verified badge, follow/message/edit actions, and ARIA attributes.

---

## Exercise 3: UserProfile Demo Page

**Prompt:**
> Create a demo page that showcases the UserProfile component with sample data. Include a few different user profiles to demonstrate the component.

**What AI did:** Created `sampleProfiles.ts` with six profile variants and `UserProfileDemoPage.tsx` with a responsive grid and independent follow-state per profile.

---

## Exercise 4: ProductCard Component

**Prompt:**
> Create a ProductCard component for an e-commerce application. Include product image, title, description, price, star rating, and an "Add to Cart" button. Use TypeScript for props and Tailwind CSS for styling. Make it responsive with smooth hover effects and animations. Include accessibility features.

**What AI did:** Built `ProductCard.tsx` and a reusable `StarRating` component with half-star support, sale pricing, hover animations, and accessible labels.

---

## Exercise 5: Navigation Bar

**Prompt:**
> Create a responsive navigation bar component with logo, menu items, search bar, and user profile dropdown. Include mobile hamburger menu. Use TypeScript and Tailwind CSS. Make it sticky on scroll with smooth animations.

**What AI did:** Built `Navbar.tsx` with sticky scroll effects, mobile overlay menu, search form, user dropdown, and keyboard/ARIA support.

---

## Exercise 6: Task Management Dashboard

**Prompt:**
> Create a responsive dashboard for a task management application. Include a sidebar navigation, main content area with task cards, statistics widgets, and a header with user menu. Use Tailwind CSS for styling with proper responsive breakpoints, dark mode support, and accessibility features.

**What AI did:** Built `DashboardLayout`, `DashboardSidebar`, `DashboardHeader`, `StatWidget`, and `TaskCard` with a responsive grid and dark mode via `useTheme`.

---

## Exercise 7: Settings Panel

**Prompt:**
> Create a settings panel component with tabs for Profile, Notifications, Privacy, and Appearance. Include form inputs, toggle switches, dropdowns, and save buttons. Use Tailwind CSS with dark mode support. Make it responsive and accessible.

**What AI did:** Built `SettingsPanel.tsx` with WAI-ARIA tabs, `ToggleSwitch`, form field components, per-tab save with loading/success feedback, and theme integration.

---

## Exercise 8: Analytics Dashboard

**Prompt:**
> Create a data analytics dashboard with chart placeholders, KPI cards, and data tables. Include filter controls and date range selectors. Use Tailwind CSS for styling with a modern, professional design. Support dark mode.

**What AI did:** Built KPI cards, SVG chart placeholders, campaign data table, and filter bar with date presets, category/region dropdowns.

---

## Exercise 9: Playwright E2E Tests (Task Management)

**Prompt:**
> Create comprehensive E2E tests for a task management application using Playwright. Test the complete user workflow including user registration, login, task creation, task completion, task deletion, and logout. Include accessibility tests, responsive design tests, and error handling scenarios.

**What AI did:** Added auth/task flows with localStorage, `data-testid` attributes, and four test suites (workflow, accessibility with axe-core, responsive, error handling) — 21 tests total.

---

## Exercise 10: Product Search E2E Tests

**Prompt:**
> Create Playwright E2E tests for a product search feature. Test search input, filter by category, price range filtering, sort options, and pagination. Include tests for empty results and error states.

**What AI did:** Built `ProductSearchPage` with filters and pagination, then wrote 14 Playwright tests covering search, filters, sort, pagination, empty states, and error recovery.

---

## Exercise 11: Team Collaboration Dashboard

**Prompt:**
> Build a complete task management dashboard for a team collaboration tool. Include a project overview, team member avatars, task progress charts, recent activity feed, and quick action buttons. Integrate all components into a cohesive interface with proper state management and responsive design.

**What AI did:** Extended `TaskContext` with activity logging, built team components (`ProjectOverview`, `TeamMemberAvatars`, `TaskProgressChart`, `ActivityFeed`, `QuickActions`), and integrated them into the main dashboard.

---

## Exercise 12: Kanban Board

**Prompt:**
> Create a Kanban board component with columns for Todo, In Progress, and Done. Include task cards with assignees, due dates, and priority labels. Add placeholders for drag-and-drop functionality. Use TypeScript and Tailwind CSS with dark mode support.

**What AI did:** Built `KanbanBoard`, `KanbanColumn`, and `KanbanCard` with HTML5 drag-and-drop, drop zone placeholders, `data-kanban-*` hooks for future library integration, and a `/board` route.

---

## Tips for Effective AI-Assisted Development

1. **Be specific about requirements** — List features, tech stack, and constraints (accessibility, responsive, dark mode).
2. **Build incrementally** — One component or feature per prompt; integrate in follow-up prompts.
3. **Ask for test coverage** — Explicitly request E2E tests, accessibility checks, and error scenarios.
4. **Request publication artifacts** — README, screenshots, and test reports for course submission.
5. **Review and iterate** — Run `npm run build` and `npm run test:e2e` after each major change.

---

## Submission Checklist

- [x] README with setup instructions
- [x] Screenshots in `docs/screenshots/`
- [x] Playwright test report in `docs/test-report/`
- [x] AI prompts documented in this file
