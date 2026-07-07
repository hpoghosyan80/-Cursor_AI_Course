import { expect, type Page } from '@playwright/test'
import type { TaskDetails } from './DashboardPage'

export class TaskFormModal {
  constructor(private readonly page: Page) {}

  private get modal() {
    return this.page.getByTestId('task-form-modal')
  }

  async fillAndSubmit({
    title,
    description,
    priority = 'medium',
    dueDate,
  }: TaskDetails): Promise<void> {
    await expect(this.modal).toBeVisible()
    await this.page.getByTestId('task-title-input').fill(title)
    await this.page.getByTestId('task-description-input').fill(description)
    await this.page.getByTestId('task-priority-select').selectOption(priority)
    await this.page.getByTestId('task-due-date-input').fill(dueDate)
    await this.page.getByTestId('task-form-submit').click()
    await expect(this.modal).not.toBeVisible()
  }
}
