import { expect, test } from '@playwright/test'

async function gotoProductSearch(page: import('@playwright/test').Page) {
  await page.goto('/products')
  await expect(page.getByTestId('product-search-page')).toBeVisible()
}

async function submitSearch(page: import('@playwright/test').Page) {
  await page.getByTestId('product-search-submit').click()
  await page.waitForTimeout(350)
}

function productCards(page: import('@playwright/test').Page) {
  return page.getByTestId('product-card')
}

function productTitles(page: import('@playwright/test').Page) {
  return page.getByTestId('product-card-title')
}

test.describe('Product search', () => {
  test.beforeEach(async ({ page }) => {
    await gotoProductSearch(page)
  })

  test('displays all products by default after search', async ({ page }) => {
    await submitSearch(page)
    await expect(page.getByTestId('product-results-count')).toContainText('14 products found')
    await expect(productCards(page)).toHaveCount(4)
    await expect(page.getByTestId('product-pagination')).toBeVisible()
  })

  test('filters products by search query', async ({ page }) => {
    await page.getByTestId('product-search-input').fill('headphones')
    await submitSearch(page)

    await expect(page.getByTestId('product-results-count')).toContainText('1 product found')
    await expect(productTitles(page)).toHaveText(['Wireless Headphones'])
  })

  test('filters products by category', async ({ page }) => {
    await page.getByTestId('product-category-filter').selectOption('electronics')
    await submitSearch(page)

    await expect(page.getByTestId('product-results-count')).toContainText('5 products found')
    await expect(productCards(page)).toHaveCount(4)
    await expect(productTitles(page).filter({ hasText: 'Cotton T-Shirt' })).toHaveCount(0)
    await expect(productTitles(page).filter({ hasText: 'Wireless Headphones' })).toHaveCount(1)
  })

  test('filters products by price range', async ({ page }) => {
    await page.getByTestId('product-min-price').fill('50')
    await page.getByTestId('product-max-price').fill('100')
    await submitSearch(page)

    await expect(page.getByTestId('product-results-count')).toContainText('5 products found')

    const prices = await page.getByTestId('product-card-price').allTextContents()
    for (const priceText of prices) {
      const value = Number(priceText.replace(/[^0-9.]/g, ''))
      expect(value).toBeGreaterThanOrEqual(50)
      expect(value).toBeLessThanOrEqual(100)
    }
  })

  test('sorts products by price low to high', async ({ page }) => {
    await page.getByTestId('product-sort-select').selectOption('price-asc')
    await submitSearch(page)

    const prices = await page.getByTestId('product-card-price').allTextContents()
    const numericPrices = prices.map((p) => Number(p.replace(/[^0-9.]/g, '')))
    const sorted = [...numericPrices].sort((a, b) => a - b)
    expect(numericPrices).toEqual(sorted)
    expect(numericPrices[0]).toBeLessThanOrEqual(25)
  })

  test('sorts products by price high to low', async ({ page }) => {
    await page.getByTestId('product-sort-select').selectOption('price-desc')
    await submitSearch(page)

    const prices = await page.getByTestId('product-card-price').allTextContents()
    const numericPrices = prices.map((p) => Number(p.replace(/[^0-9.]/g, '')))
    const sorted = [...numericPrices].sort((a, b) => b - a)
    expect(numericPrices).toEqual(sorted)
    expect(numericPrices[0]).toBeGreaterThanOrEqual(200)
  })

  test('sorts products by name A–Z', async ({ page }) => {
    await page.getByTestId('product-sort-select').selectOption('name')
    await submitSearch(page)

    const titles = await productTitles(page).allTextContents()
    const sorted = [...titles].sort((a, b) => a.localeCompare(b))
    expect(titles).toEqual(sorted)
  })

  test('paginates through results', async ({ page }) => {
    await submitSearch(page)

    await expect(page.getByTestId('pagination-info')).toContainText('Page 1 of 4')
    const page1Titles = await productTitles(page).allTextContents()

    await page.getByTestId('pagination-next').click()
    await expect(page.getByTestId('pagination-info')).toContainText('Page 2 of 4')
    const page2Titles = await productTitles(page).allTextContents()
    expect(page2Titles).not.toEqual(page1Titles)

    await page.getByTestId('pagination-page-3').click()
    await expect(page.getByTestId('pagination-info')).toContainText('Page 3 of 4')

    await page.getByTestId('pagination-prev').click()
    await expect(page.getByTestId('pagination-info')).toContainText('Page 2 of 4')
  })

  test('combines search, category, and price filters', async ({ page }) => {
    await page.getByTestId('product-search-input').fill('watch')
    await page.getByTestId('product-category-filter').selectOption('electronics')
    await page.getByTestId('product-min-price').fill('200')
    await page.getByTestId('product-max-price').fill('350')
    await submitSearch(page)

    await expect(page.getByTestId('product-results-count')).toContainText('1 product found')
    await expect(productTitles(page)).toHaveText(['Smart Watch Pro'])
  })

  test('reset clears all filters and restores results', async ({ page }) => {
    await page.getByTestId('product-search-input').fill('nonexistent')
    await page.getByTestId('product-category-filter').selectOption('sports')
    await submitSearch(page)
    await expect(page.getByTestId('product-empty-results')).toBeVisible()

    await page.getByTestId('product-search-reset').click()
    await submitSearch(page)
    await expect(page.getByTestId('product-results-count')).toContainText('14 products found')
  })
})

test.describe('Product search — empty and error states', () => {
  test.beforeEach(async ({ page }) => {
    await gotoProductSearch(page)
  })

  test('shows empty state when no products match', async ({ page }) => {
    await page.getByTestId('product-search-input').fill('xyznonexistent999')
    await submitSearch(page)

    await expect(page.getByTestId('product-empty-results')).toBeVisible()
    await expect(page.getByTestId('product-empty-results')).toContainText('No products found')
    await expect(page.getByTestId('product-results-count')).toContainText('0 products found')
    await expect(productCards(page)).toHaveCount(0)
  })

  test('shows empty state when price range excludes all products', async ({ page }) => {
    await page.getByTestId('product-min-price').fill('500')
    await submitSearch(page)

    await expect(page.getByTestId('product-empty-results')).toBeVisible()
    await expect(page.getByTestId('product-results-count')).toContainText('0 products found')
  })

  test('shows error state for trigger-error query', async ({ page }) => {
    await page.getByTestId('product-search-input').fill('trigger-error')
    await submitSearch(page)

    await expect(page.getByTestId('product-search-error')).toBeVisible()
    await expect(page.getByTestId('product-search-error')).toHaveAttribute('role', 'alert')
    await expect(page.getByTestId('product-search-error')).toContainText('Something went wrong')
    await expect(page.getByTestId('product-results-grid')).not.toBeVisible()
  })

  test('recovers from error state after successful search', async ({ page }) => {
    await page.getByTestId('product-search-input').fill('trigger-error')
    await submitSearch(page)
    await expect(page.getByTestId('product-search-error')).toBeVisible()

    await page.getByTestId('product-search-input').fill('lamp')
    await submitSearch(page)

    await expect(page.getByTestId('product-search-error')).not.toBeVisible()
    await expect(productTitles(page)).toHaveText(['Desk Lamp'])
  })
})
