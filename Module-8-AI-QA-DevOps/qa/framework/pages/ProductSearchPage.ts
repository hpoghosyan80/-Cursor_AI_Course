import { expect, type Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class ProductSearchPage extends BasePage {
  readonly pageRoot = this.locator('product-search-page')
  readonly searchInput = this.locator('product-search-input')
  readonly submitButton = this.locator('product-search-submit')
  readonly resetButton = this.locator('product-search-reset')
  readonly categoryFilter = this.locator('product-category-filter')
  readonly minPrice = this.locator('product-min-price')
  readonly maxPrice = this.locator('product-max-price')
  readonly sortSelect = this.locator('product-sort-select')
  readonly resultsCount = this.locator('product-results-count')
  readonly emptyResults = this.locator('product-empty-results')
  readonly searchError = this.locator('product-search-error')
  readonly resultsGrid = this.locator('product-results-grid')
  readonly pagination = this.locator('product-pagination')
  readonly paginationInfo = this.locator('pagination-info')
  readonly paginationNext = this.locator('pagination-next')
  readonly paginationPrev = this.locator('pagination-prev')

  async open(): Promise<void> {
    await this.goto('/products')
    await expect(this.pageRoot).toBeVisible()
  }

  async submitSearch(): Promise<void> {
    await this.submitButton.click()
    await this.page.waitForTimeout(350)
  }

  productCards(): Locator {
    return this.page.getByTestId('product-card')
  }

  productTitles(): Locator {
    return this.page.getByTestId('product-card-title')
  }

  productPrices(): Locator {
    return this.page.getByTestId('product-card-price')
  }

  async goToPage(pageNumber: number): Promise<void> {
    await this.page.getByTestId(`pagination-page-${pageNumber}`).click()
  }
}
