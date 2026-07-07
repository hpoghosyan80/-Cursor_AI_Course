import { createTask, expect, registerUser, resetAppState, test } from './helpers'

test.describe('Responsive design', () => {
  test.beforeEach(async ({ page, uniqueEmail }) => {
    await resetAppState(page)
    await registerUser(page, {
      name: 'Responsive User',
      email: uniqueEmail,
      password: 'securepass123',
    })
    await createTask(page, {
      title: 'Mobile friendly task',
      description: 'Should display correctly on all screen sizes.',
      dueDate: '2026-11-01',
    })
  })

  test('mobile viewport shows dashboard and task list', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })

    await expect(page.getByTestId('dashboard-page')).toBeVisible()
    await expect(page.getByTestId('stats-grid')).toBeVisible()
    await expect(page.getByTestId('task-card-title').filter({ hasText: 'Mobile friendly task' })).toBeVisible()

    // Sidebar should be hidden on mobile until toggled
    await expect(page.getByLabel('Dashboard navigation')).not.toBeInViewport()
  })

  test('mobile sidebar opens via hamburger menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })

    await page.getByLabel('Open navigation menu').click()
    await expect(page.getByLabel('Dashboard navigation')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()
  })

  test('tablet viewport shows two-column task grid', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })

    await createTask(page, {
      title: 'Second tablet task',
      description: 'For grid layout testing.',
      dueDate: '2026-11-15',
    })

    const taskList = page.getByTestId('task-list')
    await expect(taskList).toBeVisible()
    await expect(taskList.locator('[data-testid="task-card"]')).toHaveCount(2)
  })

  test('desktop viewport shows full header with user name', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })

    await expect(page.getByTestId('user-menu-button')).toContainText('Responsive User')
    await expect(page.getByLabel('Dashboard navigation')).toBeVisible()
  })

  test('login page is centered on all viewports', async ({ page }) => {
    await resetAppState(page)
    await page.goto('/login')

    for (const size of [
      { width: 375, height: 812 },
      { width: 768, height: 1024 },
      { width: 1280, height: 800 },
    ]) {
      await page.setViewportSize(size)
      await expect(page.getByTestId('login-page')).toBeVisible()
      await expect(page.getByTestId('login-submit')).toBeVisible()
    }
  })
})
