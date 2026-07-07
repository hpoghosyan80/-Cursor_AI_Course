import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  readonly emailInput = this.locator('login-email')
  readonly passwordInput = this.locator('login-password')
  readonly submitButton = this.locator('login-submit')
  readonly pageRoot = this.locator('login-page')

  async open(): Promise<void> {
    await this.goto('/login')
    await expect(this.pageRoot).toBeVisible()
  }

  async login(email: string, password: string): Promise<void> {
    await this.open()
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
    await expect(this.page.getByTestId('dashboard-page')).toBeVisible()
  }

  async expectVisible(): Promise<void> {
    await expect(this.pageRoot).toBeVisible()
  }
}
