import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { ProductCard } from '@/components/common/ProductCard'
import { Button } from '@/components/ui/Button'
import {
  ERROR_TRIGGER_QUERY,
  PAGE_SIZE,
  categoryOptions,
  filterAndSortProducts,
  paginateProducts,
  sampleProducts,
  sortOptions,
  type SortOption,
} from '@/data/sampleProducts'

export function ProductSearchPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState<SortOption>('relevance')
  const [page, setPage] = useState(1)
  const [applied, setApplied] = useState({
    query: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    sort: 'relevance' as SortOption,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const applyFilters = useCallback(() => {
    setError(null)

    if (query.trim().toLowerCase() === ERROR_TRIGGER_QUERY) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setError('Something went wrong while searching. Please try again.')
      }, 300)
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setApplied({ query, category, minPrice, maxPrice, sort })
      setPage(1)
      setIsLoading(false)
    }, 200)
  }, [query, category, minPrice, maxPrice, sort])

  const resetFilters = useCallback(() => {
    setQuery('')
    setCategory('all')
    setMinPrice('')
    setMaxPrice('')
    setSort('relevance')
    setApplied({ query: '', category: 'all', minPrice: '', maxPrice: '', sort: 'relevance' })
    setPage(1)
    setError(null)
  }, [])

  const filtered = useMemo(
    () =>
      filterAndSortProducts(sampleProducts, {
        query: applied.query,
        category: applied.category,
        minPrice: applied.minPrice ? Number(applied.minPrice) : null,
        maxPrice: applied.maxPrice ? Number(applied.maxPrice) : null,
        sort: applied.sort,
      }),
    [applied],
  )

  const { items, totalPages, currentPage, totalItems } = useMemo(
    () => paginateProducts(filtered, page, PAGE_SIZE),
    [filtered, page],
  )

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    applyFilters()
  }

  return (
    <div className="min-h-svh bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            Product Search
          </h1>
        </div>
      </header>

      <main
        className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8"
        data-testid="product-search-page"
      >
        <form
          onSubmit={handleSubmit}
          aria-label="Product search filters"
          data-testid="product-search-form"
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-4">
              <label
                htmlFor="product-search-input"
                className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-white"
              >
                Search products
              </label>
              <input
                id="product-search-input"
                data-testid="product-search-input"
                type="search"
                placeholder="Search by name or description…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="product-category-filter"
                className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-white"
              >
                Category
              </label>
              <select
                id="product-category-filter"
                data-testid="product-category-filter"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="product-sort-select"
                className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-white"
              >
                Sort by
              </label>
              <select
                id="product-sort-select"
                data-testid="product-sort-select"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="product-min-price"
                className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-white"
              >
                Min price ($)
              </label>
              <input
                id="product-min-price"
                data-testid="product-min-price"
                type="number"
                min={0}
                step={0.01}
                placeholder="0"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="product-max-price"
                className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-white"
              >
                Max price ($)
              </label>
              <input
                id="product-max-price"
                data-testid="product-max-price"
                type="number"
                min={0}
                step={0.01}
                placeholder="Any"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="submit" data-testid="product-search-submit" disabled={isLoading}>
              {isLoading ? 'Searching…' : 'Search'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              data-testid="product-search-reset"
              onClick={resetFilters}
            >
              Reset
            </Button>
          </div>
        </form>

        {error && (
          <div
            role="alert"
            data-testid="product-search-error"
            className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
          >
            {error}
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <p
            data-testid="product-results-count"
            className="text-sm text-slate-500 dark:text-slate-400"
            role="status"
          >
            {isLoading
              ? 'Searching…'
              : `${totalItems} product${totalItems !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {!isLoading && !error && totalItems === 0 && (
          <div
            role="status"
            data-testid="product-empty-results"
            className="rounded-xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700"
          >
            <p className="text-lg font-medium text-slate-900 dark:text-white">
              No products found
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        {!isLoading && !error && totalItems > 0 && (
          <>
            <div
              data-testid="product-results-grid"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                aria-label="Product results pagination"
                data-testid="product-pagination"
                className="flex items-center justify-center gap-2"
              >
                <button
                  type="button"
                  data-testid="pagination-prev"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  aria-label="Previous page"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Previous
                </button>

                <span data-testid="pagination-info" className="px-3 text-sm text-slate-600 dark:text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    data-testid={`pagination-page-${pageNum}`}
                    aria-label={`Page ${pageNum}`}
                    aria-current={pageNum === currentPage ? 'page' : undefined}
                    onClick={() => setPage(pageNum)}
                    className={`size-9 rounded-lg text-sm font-medium transition-colors ${
                      pageNum === currentPage
                        ? 'bg-indigo-600 text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  data-testid="pagination-next"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label="Next page"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  )
}
