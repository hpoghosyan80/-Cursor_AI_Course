import { useId } from 'react'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/ui/StarRating'

export interface Product {
  id: string
  title: string
  description: string
  price: number
  currency?: string
  imageUrl: string
  imageAlt?: string
  rating: number
  reviewCount?: number
  badge?: string
  originalPrice?: number
}

export interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
  isAddingToCart?: boolean
  className?: string
}

function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function ProductCard({
  product,
  onAddToCart,
  isAddingToCart = false,
  className = '',
}: ProductCardProps) {
  const titleId = useId()
  const currency = product.currency ?? 'USD'
  const isOnSale =
    product.originalPrice !== undefined && product.originalPrice > product.price

  return (
    <article
      aria-labelledby={titleId}
      data-testid="product-card"
      data-product-title={product.title}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/10 ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
        <img
          src={product.imageUrl}
          alt={product.imageAlt ?? product.title}
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-md">
            {product.badge}
          </span>
        )}

        {isOnSale && !product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-md">
            Sale
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
          size="sm"
          className="mb-2"
        />

        <h3
          id={titleId}
          data-testid="product-card-title"
          className="line-clamp-2 text-base font-semibold leading-snug text-white transition-colors group-hover:text-indigo-300 sm:text-lg"
        >
          {product.title}
        </h3>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-400">
          {product.description}
        </p>

        {/* Price */}
        <div className="mt-4 flex flex-wrap items-baseline gap-2">
          <span
            data-testid="product-card-price"
            className="text-lg font-bold tabular-nums text-white sm:text-xl"
            aria-label={`Price: ${formatPrice(product.price, currency)}`}
          >
            {formatPrice(product.price, currency)}
          </span>
          {isOnSale && (
            <span
              className="text-sm text-slate-500 line-through tabular-nums"
              aria-label={`Original price: ${formatPrice(product.originalPrice!, currency)}`}
            >
              {formatPrice(product.originalPrice!, currency)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <Button
          variant="primary"
          className="mt-4 w-full transition-transform duration-200 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
          disabled={isAddingToCart}
          onClick={() => onAddToCart?.(product.id)}
          aria-label={`Add ${product.title} to cart`}
        >
          {isAddingToCart ? (
            <span className="inline-flex items-center gap-2">
              <svg
                aria-hidden="true"
                className="size-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Adding…
            </span>
          ) : (
            'Add to Cart'
          )}
        </Button>
      </div>
    </article>
  )
}
