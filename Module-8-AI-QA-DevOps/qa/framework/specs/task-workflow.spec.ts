import { expect, test } from '../fixtures'

test.describe('Task workflow (POM)', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.resetAppState()
  })

  test('complete journey: register → create → complete → delete → logout', async ({
    registerPage,
    dashboardPage,
    loginPage,
    uniqueEmail,
  }) => {
    const password = 'securepass123'
    const taskTitle = 'Write E2E test suite'

    await registerPage.register({
      name: 'Test User',
      email: uniqueEmail,
      password,
    })
    await expect(dashboardPage.taskCount).toContainText('0 tasks shown')

    await dashboardPage.createTask({
      title: taskTitle,
      description: 'Build comprehensive Playwright tests for the app.',
      priority: 'high',
      dueDate: '2026-12-31',
    })
    await expect(dashboardPage.taskCount).toContainText('1 task shown')

    const taskCard = dashboardPage.taskCardByTitle(taskTitle)
    await expect(taskCard).toBeVisible()

    await dashboardPage.markTaskDone(taskTitle)
    await dashboardPage.filterByDone()
    await expect(taskCard).toBeVisible()

    await dashboardPage.deleteTask(taskTitle)
    await expect(dashboardPage.emptyTaskList).toBeVisible()

    await dashboardPage.logout()
    await loginPage.expectVisible()
  })

  test('registered user can log in and manage tasks', async ({
    registerPage,
    dashboardPage,
    loginPage,
    uniqueEmail,
  }) => {
    const password = 'securepass123'

    await registerPage.register({
      name: 'Returning User',
      email: uniqueEmail,
      password,
    })
    await dashboardPage.logout()

    await loginPage.login(uniqueEmail, password)
    await dashboardPage.expectVisible()

    await dashboardPage.createTask({
      title: 'Review pull request',
      description: 'Check CI and merge when green.',
      dueDate: '2026-08-15',
    })
    await expect(dashboardPage.taskCardByTitle('Review pull request')).toBeVisible()
  })
})
