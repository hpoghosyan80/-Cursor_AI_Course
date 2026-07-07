import type { Product } from '@/components/common/ProductCard'

export type ProductCategory = 'electronics' | 'clothing' | 'home' | 'sports'

export interface CatalogProduct extends Product {
  category: ProductCategory
}

export const PAGE_SIZE = 4

export const categoryOptions = [
  { value: 'all', label: 'All categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports' },
] as const

export const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name: A–Z' },
] as const

export type SortOption = (typeof sortOptions)[number]['value']

export const sampleProducts: CatalogProduct[] = [
  {
    id: '1',
    title: 'Wireless Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life.',
    price: 149.99,
    originalPrice: 199.99,
    category: 'electronics',
    imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=headphones',
    rating: 4.5,
    reviewCount: 1284,
    badge: 'Bestseller',
  },
  {
    id: '2',
    title: 'Smart Watch Pro',
    description: 'Track fitness, receive notifications, and monitor health metrics.',
    price: 299.99,
    category: 'electronics',
    imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=watch',
    rating: 4.7,
    reviewCount: 892,
  },
  {
    id: '3',
    title: 'Laptop Stand',
    description: 'Ergonomic aluminum stand for better posture and airflow.',
    price: 49.99,
    category: 'electronics',
    imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=stand',
    rating: 4.3,
    reviewCount: 456,
  },
  {
    id: '4',
    title: 'Cotton T-Shirt',
    description: 'Soft organic cotton tee available in multiple colors.',
    price: 24.99,
    category: 'clothing',
    imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=tshirt',
    rating: 4.1,
    reviewCount: 320,
  },
  {
    id: '5',
    title: 'Running Shoes',
    description: 'Lightweight running shoes with responsive cushioning.',
    price: 89.99,
    originalPrice: 110.0,
    category: 'sports',
    imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=shoes',
    rating: 4.6,
    reviewCount: 678,
    badge: 'Sale',
  },
  {
    id: '6',
    title: 'Yoga Mat',
    description: 'Non-slip eco-friendly mat with carrying strap.',
    price: 34.99,
    category: 'sports',
    imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=yogamat',
    rating: 4.4,
    reviewCount: 210,
  },
  {
    id: '7',
    title: 'Desk Lamp',
    description: 'Adjustable LED lamp with warm and cool light modes.',
    price: 59.99,
    category: 'home',
    imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=lamp',
    rating: 4.2,
    reviewCount: 189,
  },
  {
    id: '8',
    title: 'Coffee Maker',
    description: 'Programmable drip coffee maker with thermal carafe.',
    price: 79.99,
    category: 'home',
    imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=coffee',
    rating: 4.0,
    reviewCount: 543,
  },
  {
    id: '9',
    title: 'Winter Jacket',
    description: 'Insulated waterproof jacket for cold weather adventures.',
    price: 129.99,
    category: 'clothing',
    imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=jacket',
    rating: 4.5,
    reviewCount: 412,
  },
  {
    id: '10',
    title: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker with 360° sound.',
    price: 69.99,
    category: 'electronics',
    imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=speaker',
    rating: 4.3,
    reviewCount: 756,
  },
  {
    id: '11',
    title: 'Throw Pillow Set',
    description: 'Set of 2 decorative pillows with removable covers.',
    price: 19.99,
    category: 'home',
    imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=pillow',
    rating: 4.0,
    reviewCount: 98,
  },
  {
    id: '12',
    title: 'Gym Bag',
    description: 'Spacious duffel with shoe compartment and wet pocket.',
    price: 44.99,
    category: 'sports',
    imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=gymbag',
    rating: 4.2,
    reviewCount: 167,
  },
  {
    id: '13',
    title: 'Slim Fit Jeans',
    description: 'Classic slim fit denim with stretch comfort.',
    price: 59.99,
    category: 'clothing',
    imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=jeans',
    rating: 4.1,
    reviewCount: 289,
  },
  {
    id: '14',
    title: 'Monitor Arm',
    description: 'Dual monitor mount with full motion adjustment.',
    price: 119.99,
    category: 'electronics',
    imageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=monitor',
    rating: 4.6,
    reviewCount: 334,
  },
]

/** Special query that triggers the error state in the search UI. */
export const ERROR_TRIGGER_QUERY = 'trigger-error'

export function filterAndSortProducts(
  products: CatalogProduct[],
  {
    query,
    category,
    minPrice,
    maxPrice,
    sort,
  }: {
    query: string
    category: string
    minPrice: number | null
    maxPrice: number | null
    sort: SortOption
  },
): CatalogProduct[] {
  let results = [...products]

  if (query.trim()) {
    const term = query.trim().toLowerCase()
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term),
    )
  }

  if (category !== 'all') {
    results = results.filter((p) => p.category === category)
  }

  if (minPrice !== null) {
    results = results.filter((p) => p.price >= minPrice)
  }

  if (maxPrice !== null) {
    results = results.filter((p) => p.price <= maxPrice)
  }

  switch (sort) {
    case 'price-asc':
      results.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      results.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      results.sort((a, b) => b.rating - a.rating)
      break
    case 'name':
      results.sort((a, b) => a.title.localeCompare(b.title))
      break
    default:
      break
  }

  return results
}

export function paginateProducts<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    totalPages,
    currentPage: safePage,
    totalItems: items.length,
  }
}
