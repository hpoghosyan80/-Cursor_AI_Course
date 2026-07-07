import { expect, type Locator } from '@playwright/test'
import { BasePage } from './BasePage'
import { TaskFormModal } from './TaskFormModal'

export interface TaskDetails {
  title: string
  description: string
  priority?: 'low' | 'medium' | 'high'
  dueDate: string
}

export class DashboardPage extends BasePage {
  readonly pageRoot = this.locator('dashboard-page')
  readonly newTaskButton = this.locator('new-task-button')
  readonly taskCount = this.locator('task-count')
  readonly emptyTaskList = this.locator('empty-task-list')
  readonly userMenuButton = this.locator('user-menu-button')
  readonly logoutButton = this.locator('logout-button')
  readonly filterDone = this.locator('filter-done')

  readonly taskForm = new TaskFormModal(this.page)

  async expectVisible(): Promise<void> {
    await expect(this.pageRoot).toBeVisible()
  }

  async createTask(details: TaskDetails): Promise<void> {
    await this.newTaskButton.click()
    await this.taskForm.fillAndSubmit(details)
  }

  taskCardByTitle(title: string): Locator {
    return this.page.locator('[data-testid="task-card"]', { hasText: title })
  }

  async markTaskDone(title: string): Promise<void> {
    const card = this.taskCardByTitle(title)
    await card.getByTestId('task-status-select').selectOption('done')
    await expect(card.getByTestId('task-card-title')).toHaveClass(/line-through/)
  }

  async deleteTask(title: string): Promise<void> {
    const card = this.taskCardByTitle(title)
    await card.getByTestId('task-delete-button').click()
    await expect(card).not.toBeVisible()
  }

  async filterByDone(): Promise<void> {
    await this.filterDone.click()
  }

  async logout(): Promise<void> {
    await this.userMenuButton.click()
    await this.logoutButton.click()
    await expect(this.page.getByTestId('login-page')).toBeVisible()
  }
}
