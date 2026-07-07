import { expect, test } from '../fixtures'

test.describe('Product search (POM)', () => {
  test.beforeEach(async ({ productSearchPage }) => {
    await productSearchPage.open()
  })

  test('displays all products by default after search', async ({ productSearchPage }) => {
    await productSearchPage.submitSearch()
    await expect(productSearchPage.resultsCount).toContainText('14 products found')
    await expect(productSearchPage.productCards()).toHaveCount(4)
    await expect(productSearchPage.pagination).toBeVisible()
  })

  test('filters products by search query', async ({ productSearchPage }) => {
    await productSearchPage.searchInput.fill('headphones')
    await productSearchPage.submitSearch()

    await expect(productSearchPage.resultsCount).toContainText('1 product found')
    await expect(productSearchPage.productTitles()).toHaveText(['Wireless Headphones'])
  })

  test('filters products by category', async ({ productSearchPage }) => {
    await productSearchPage.categoryFilter.selectOption('electronics')
    await productSearchPage.submitSearch()

    await expect(productSearchPage.resultsCount).toContainText('5 products found')
    await expect(productSearchPage.productCards()).toHaveCount(4)
    await expect(
      productSearchPage.productTitles().filter({ hasText: 'Cotton T-Shirt' }),
    ).toHaveCount(0)
  })

  test('sorts products by price low to high', async ({ productSearchPage }) => {
    await productSearchPage.sortSelect.selectOption('price-asc')
    await productSearchPage.submitSearch()

    const prices = await productSearchPage.productPrices().allTextContents()
    const numericPrices = prices.map((p) => Number(p.replace(/[^0-9.]/g, '')))
    const sorted = [...numericPrices].sort((a, b) => a - b)
    expect(numericPrices).toEqual(sorted)
  })

  test('paginates through results', async ({ productSearchPage }) => {
    await productSearchPage.submitSearch()
    await expect(productSearchPage.paginationInfo).toContainText('Page 1 of 4')

    const page1Titles = await productSearchPage.productTitles().allTextContents()
    await productSearchPage.paginationNext.click()
    await expect(productSearchPage.paginationInfo).toContainText('Page 2 of 4')

    const page2Titles = await productSearchPage.productTitles().allTextContents()
    expect(page2Titles).not.toEqual(page1Titles)
  })

  test('shows empty state when no products match', async ({ productSearchPage }) => {
    await productSearchPage.searchInput.fill('xyznonexistent999')
    await productSearchPage.submitSearch()

    await expect(productSearchPage.emptyResults).toBeVisible()
    await expect(productSearchPage.resultsCount).toContainText('0 products found')
    await expect(productSearchPage.productCards()).toHaveCount(0)
  })

  test('shows error state for trigger-error query', async ({ productSearchPage }) => {
    await productSearchPage.searchInput.fill('trigger-error')
    await productSearchPage.submitSearch()

    await expect(productSearchPage.searchError).toBeVisible()
    await expect(productSearchPage.searchError).toHaveAttribute('role', 'alert')
    await expect(productSearchPage.resultsGrid).not.toBeVisible()
  })
})
