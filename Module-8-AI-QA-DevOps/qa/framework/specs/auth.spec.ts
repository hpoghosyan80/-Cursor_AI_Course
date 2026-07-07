import { expect, test } from '../fixtures'

test.describe('Authentication (POM)', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.resetAppState()
  })

  test('redirects unauthenticated users to login', async ({ page, loginPage }) => {
    await page.goto('/dashboard')
    await loginPage.expectVisible()
  })

  test('redirects authenticated users away from login', async ({
    page,
    registerPage,
    dashboardPage,
    uniqueEmail,
  }) => {
    await registerPage.register({
      name: 'Auth User',
      email: uniqueEmail,
      password: 'securepass123',
    })

    await page.goto('/login')
    await dashboardPage.expectVisible()
  })
})
