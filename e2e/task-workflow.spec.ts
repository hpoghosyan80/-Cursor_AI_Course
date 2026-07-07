import {
  createTask,
  expect,
  loginUser,
  logout,
  registerUser,
  resetAppState,
  taskCardByTitle,
  test,
} from './helpers'

test.describe('Task management workflow', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppState(page)
  })

  test('complete user journey: register → create task → complete → delete → logout', async ({
    page,
    uniqueEmail,
  }) => {
    const password = 'securepass123'
    const taskTitle = 'Write E2E test suite'
    const futureDate = '2026-12-31'

    // Registration
    await registerUser(page, {
      name: 'Test User',
      email: uniqueEmail,
      password,
    })
    await expect(page.getByTestId('task-count')).toContainText('0 tasks shown')

    // Create task
    await createTask(page, {
      title: taskTitle,
      description: 'Build comprehensive Playwright tests for the app.',
      priority: 'high',
      dueDate: futureDate,
    })
    await expect(page.getByTestId('task-count')).toContainText('1 task shown')
    const taskCard = taskCardByTitle(page, taskTitle)
    await expect(taskCard).toBeVisible()

    // Complete task
    await taskCard.getByTestId('task-status-select').selectOption('done')
    await expect(taskCard.getByTestId('task-card-title')).toHaveClass(/line-through/)

    // Filter to done tasks
    await page.getByTestId('filter-done').click()
    await expect(taskCard).toBeVisible()
    await expect(page.getByTestId('task-count')).toContainText('1 task shown')

    // Delete task
    await taskCard.getByTestId('task-delete-button').click()
    await expect(taskCard).not.toBeVisible()
    await expect(page.getByTestId('empty-task-list')).toBeVisible()

    // Logout
    await logout(page)
    await expect(page).toHaveURL(/\/login/)
  })

  test('registered user can log in and manage tasks', async ({ page, uniqueEmail }) => {
    const password = 'securepass123'

    await registerUser(page, {
      name: 'Returning User',
      email: uniqueEmail,
      password,
    })
    await logout(page)

    await loginUser(page, { email: uniqueEmail, password })
    await expect(page.getByTestId('dashboard-page')).toBeVisible()

    await createTask(page, {
      title: 'Review pull request',
      description: 'Check CI and merge when green.',
      dueDate: '2026-08-15',
    })
    await expect(taskCardByTitle(page, 'Review pull request')).toBeVisible()
  })

  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByTestId('login-page')).toBeVisible()
  })

  test('redirects authenticated users away from login', async ({ page, uniqueEmail }) => {
    await registerUser(page, {
      name: 'Auth User',
      email: uniqueEmail,
      password: 'securepass123',
    })

    await page.goto('/login')
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
  })
})
