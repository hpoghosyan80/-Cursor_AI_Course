import { createTask, expect, registerUser, resetAppState, test } from './helpers'

test.describe('Error handling', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppState(page)
  })

  test('shows error for invalid login credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByTestId('login-email').fill('nonexistent@test.com')
    await page.getByTestId('login-password').fill('wrongpassword')
    await page.getByTestId('login-submit').click()

    await expect(page.getByTestId('login-error')).toBeVisible()
    await expect(page.getByTestId('login-error')).toContainText('Invalid email or password')
    await expect(page.getByTestId('login-page')).toBeVisible()
  })

  test('shows error when passwords do not match on registration', async ({ page }) => {
    await page.goto('/register')
    await page.getByTestId('register-name').fill('Mismatch User')
    await page.getByTestId('register-email').fill('mismatch@test.com')
    await page.getByTestId('register-password').fill('password123')
    await page.getByTestId('register-confirm-password').fill('different456')
    await page.getByTestId('register-submit').click()

    await expect(page.getByTestId('register-error')).toBeVisible()
    await expect(page.getByTestId('register-error')).toContainText('Passwords do not match')
  })

  test('shows error for password too short on registration', async ({ page }) => {
    await page.goto('/register')
    await page.getByTestId('register-name').fill('Short Pass User')
    await page.getByTestId('register-email').fill('shortpass@test.com')
    await page.getByTestId('register-password').fill('12345')
    await page.getByTestId('register-confirm-password').fill('12345')
    await page.getByTestId('register-submit').click()

    await expect(page.getByTestId('register-error')).toBeVisible()
    await expect(page.getByTestId('register-error')).toContainText('at least 6 characters')
  })

  test('shows error for duplicate email on registration', async ({ page, uniqueEmail }) => {
    const password = 'securepass123'

    await registerUser(page, {
      name: 'First User',
      email: uniqueEmail,
      password,
    })
    await page.evaluate(() => localStorage.removeItem('taskflow-session'))

    await page.goto('/register')
    await page.getByTestId('register-name').fill('Second User')
    await page.getByTestId('register-email').fill(uniqueEmail)
    await page.getByTestId('register-password').fill(password)
    await page.getByTestId('register-confirm-password').fill(password)
    await page.getByTestId('register-submit').click()

    await expect(page.getByTestId('register-error')).toBeVisible()
    await expect(page.getByTestId('register-error')).toContainText('already exists')
  })

  test('shows error when creating task with empty title', async ({ page, uniqueEmail }) => {
    await registerUser(page, {
      name: 'Task Error User',
      email: uniqueEmail,
      password: 'securepass123',
    })

    await page.getByTestId('new-task-button').click()
    await page.getByTestId('task-due-date-input').fill('2026-12-01')
    await page.getByTestId('task-form-submit').click()

    // HTML5 required validation prevents submit; verify title field is required
    const titleInput = page.getByTestId('task-title-input')
    await expect(titleInput).toHaveAttribute('required', '')
  })

  test('shows empty state when filter matches no tasks', async ({ page, uniqueEmail }) => {
    await registerUser(page, {
      name: 'Filter User',
      email: uniqueEmail,
      password: 'securepass123',
    })

    await createTask(page, {
      title: 'Active task only',
      description: 'Not done yet.',
      dueDate: '2026-12-15',
    })

    await page.getByTestId('filter-done').click()
    await expect(page.getByTestId('empty-task-list')).toBeVisible()
    await expect(page.getByTestId('empty-task-list')).toContainText('No tasks match this filter')
  })
})
