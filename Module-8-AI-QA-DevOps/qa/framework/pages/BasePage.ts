import type { Page, Locator } from '@playwright/test'

/** Base Page Object — shared navigation and wait helpers. */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string): Promise<void> {
    await this.page.goto(path)
  }

  protected locator(testId: string): Locator {
    return this.page.getByTestId(testId)
  }

  /** Clear TaskFlow localStorage keys for test isolation. */
  async resetAppState(): Promise<void> {
    await this.page.goto('/login')
    await this.page.evaluate(() => {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('taskflow-'))
        .forEach((key) => localStorage.removeItem(key))
    })
  }
}
