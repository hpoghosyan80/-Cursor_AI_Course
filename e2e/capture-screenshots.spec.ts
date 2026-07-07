/**
 * Captures screenshots for course submission documentation.
 * Run: npm run screenshots
 */
import { test } from '@playwright/test'
import { createTask, registerUser, resetAppState } from './helpers'

const DIR = 'docs/screenshots'

test.describe('Documentation screenshots', () => {
  test('capture application pages', async ({ page }) => {
    test.setTimeout(60_000)

    // Auth pages
    await page.goto('/login')
    await page.screenshot({ path: `${DIR}/01-login.png`, fullPage: true })

    await page.goto('/register')
    await page.screenshot({ path: `${DIR}/02-register.png`, fullPage: true })

    // Component demos (public)
    await page.goto('/demos/profile')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: `${DIR}/03-user-profile-demo.png`, fullPage: true })

    await page.goto('/demos/analytics')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: `${DIR}/04-analytics-dashboard.png`, fullPage: true })

    await page.goto('/demos/settings')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: `${DIR}/05-settings-panel.png`, fullPage: true })

    await page.goto('/demos/products')
    await page.getByTestId('product-search-submit').click()
    await page.waitForTimeout(400)
    await page.screenshot({ path: `${DIR}/06-product-search.png`, fullPage: true })

    // Authenticated flows
    await resetAppState(page)
    await registerUser(page, {
      name: 'Demo Student',
      email: `demo-${Date.now()}@student.edu`,
      password: 'demo123456',
    })
    await page.screenshot({ path: `${DIR}/07-team-dashboard.png`, fullPage: true })

    await createTask(page, {
      title: 'Sprint planning',
      description: 'Plan tasks for the upcoming sprint.',
      priority: 'high',
      dueDate: '2026-12-15',
    })
    await createTask(page, {
      title: 'Code review',
      description: 'Review pull requests from the team.',
      dueDate: '2026-12-10',
    })

    await page.goto('/board')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: `${DIR}/08-kanban-board.png`, fullPage: true })

    // Dark mode — team dashboard
    await page.goto('/dashboard')
    await page.getByLabel('Switch to dark mode').click()
    await page.waitForTimeout(300)
    await page.screenshot({ path: `${DIR}/09-dashboard-dark-mode.png`, fullPage: true })
  })
})
