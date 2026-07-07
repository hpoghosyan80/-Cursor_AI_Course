import { test as base, expect } from '@playwright/test'

type TestFixtures = {
  uniqueEmail: string
}

export const test = base.extend<TestFixtures>({
  uniqueEmail: async ({}, use) => {
    const email = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.com`
    await use(email)
  },
})

export { expect }

/** Reset localStorage before each test for isolation. */
export async function resetAppState(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.evaluate(() => {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith('taskflow-'),
    )
    keys.forEach((key) => localStorage.removeItem(key))
  })
}

export async function registerUser(
  page: import('@playwright/test').Page,
  {
    name,
    email,
    password,
  }: { name: string; email: string; password: string },
) {
  await page.goto('/register')
  await page.getByTestId('register-name').fill(name)
  await page.getByTestId('register-email').fill(email)
  await page.getByTestId('register-password').fill(password)
  await page.getByTestId('register-confirm-password').fill(password)
  await page.getByTestId('register-submit').click()
  await expect(page.getByTestId('dashboard-page')).toBeVisible()
}

export async function loginUser(
  page: import('@playwright/test').Page,
  { email, password }: { email: string; password: string },
) {
  await page.goto('/login')
  await page.getByTestId('login-email').fill(email)
  await page.getByTestId('login-password').fill(password)
  await page.getByTestId('login-submit').click()
  await expect(page.getByTestId('dashboard-page')).toBeVisible()
}

export async function createTask(
  page: import('@playwright/test').Page,
  {
    title,
    description,
    priority = 'medium',
    dueDate,
  }: {
    title: string
    description: string
    priority?: 'low' | 'medium' | 'high'
    dueDate: string
  },
) {
  await page.getByTestId('new-task-button').click()
  await expect(page.getByTestId('task-form-modal')).toBeVisible()
  await page.getByTestId('task-title-input').fill(title)
  await page.getByTestId('task-description-input').fill(description)
  await page.getByTestId('task-priority-select').selectOption(priority)
  await page.getByTestId('task-due-date-input').fill(dueDate)
  await page.getByTestId('task-form-submit').click()
  await expect(page.getByTestId('task-form-modal')).not.toBeVisible()
}

export async function logout(page: import('@playwright/test').Page) {
  await page.getByTestId('user-menu-button').click()
  await page.getByTestId('logout-button').click()
  await expect(page.getByTestId('login-page')).toBeVisible()
}

export function taskCardByTitle(page: import('@playwright/test').Page, title: string) {
  return page.locator('[data-testid="task-card"]', { hasText: title })
}
