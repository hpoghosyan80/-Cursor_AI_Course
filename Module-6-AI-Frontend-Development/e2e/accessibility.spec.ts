import AxeBuilder from '@axe-core/playwright'
import { createTask, expect, registerUser, resetAppState, test } from './helpers'

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await resetAppState(page)
  })

  test('login page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/login')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations.filter((v) => v.impact === 'critical')).toEqual([])
  })

  test('register page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/register')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations.filter((v) => v.impact === 'critical')).toEqual([])
  })

  test('dashboard has no critical accessibility violations', async ({
    page,
    uniqueEmail,
  }) => {
    await registerUser(page, {
      name: 'A11y User',
      email: uniqueEmail,
      password: 'securepass123',
    })

    await createTask(page, {
      title: 'Accessibility audit',
      description: 'Run axe checks on all pages.',
      dueDate: '2026-09-01',
    })

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations.filter((v) => v.impact === 'critical')).toEqual([])
  })

  test('task form modal is keyboard accessible', async ({ page, uniqueEmail }) => {
    await registerUser(page, {
      name: 'Keyboard User',
      email: uniqueEmail,
      password: 'securepass123',
    })

    await page.getByTestId('new-task-button').focus()
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('task-form-modal')).toBeVisible()

    await page.getByTestId('task-title-input').fill('Keyboard created task')
    await page.getByTestId('task-description-input').fill('Created via keyboard.')
    await page.getByTestId('task-due-date-input').fill('2026-10-01')
    await page.getByTestId('task-form-submit').click()

    await expect(page.getByTestId('task-card-title').filter({ hasText: 'Keyboard created task' })).toBeVisible()
  })

  test('form fields have associated labels', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()

    await page.goto('/register')
    await expect(page.getByLabel('Full name')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Confirm password')).toBeVisible()
  })

  test('error messages use role="alert"', async ({ page }) => {
    await page.goto('/login')
    await page.getByTestId('login-submit').click()

    // Browser validation may prevent submit; fill invalid credentials instead
    await page.getByTestId('login-email').fill('wrong@test.com')
    await page.getByTestId('login-password').fill('wrongpass')
    await page.getByTestId('login-submit').click()

    await expect(page.getByTestId('login-error')).toBeVisible()
    await expect(page.getByTestId('login-error')).toHaveAttribute('role', 'alert')
  })
})
