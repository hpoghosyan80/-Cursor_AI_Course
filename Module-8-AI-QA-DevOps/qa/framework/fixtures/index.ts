import { test as base } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { DashboardPage } from '../pages/DashboardPage'
import { ProductSearchPage } from '../pages/ProductSearchPage'

type PageObjects = {
  loginPage: LoginPage
  registerPage: RegisterPage
  dashboardPage: DashboardPage
  productSearchPage: ProductSearchPage
  uniqueEmail: string
}

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page))
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page))
  },
  productSearchPage: async ({ page }, use) => {
    await use(new ProductSearchPage(page))
  },
  uniqueEmail: async ({}, use) => {
    const email = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.com`
    await use(email)
  },
})

export { expect } from '@playwright/test'
