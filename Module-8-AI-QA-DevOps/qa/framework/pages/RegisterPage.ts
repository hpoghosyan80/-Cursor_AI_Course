import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export class RegisterPage extends BasePage {
  readonly nameInput = this.locator('register-name')
  readonly emailInput = this.locator('register-email')
  readonly passwordInput = this.locator('register-password')
  readonly confirmPasswordInput = this.locator('register-confirm-password')
  readonly submitButton = this.locator('register-submit')

  async open(): Promise<void> {
    await this.goto('/register')
  }

  async register({ name, email, password }: RegisterCredentials): Promise<void> {
    await this.open()
    await this.nameInput.fill(name)
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.confirmPasswordInput.fill(password)
    await this.submitButton.click()
    await expect(this.page.getByTestId('dashboard-page')).toBeVisible()
  }
}
