import { useId } from 'react'

export interface StarRatingProps {
  rating: number
  maxRating?: number
  reviewCount?: number
  size?: 'sm' | 'md'
  className?: string
}

function clampRating(rating: number, max: number): number {
  return Math.min(Math.max(rating, 0), max)
}

interface StarIconProps {
  fill: 'full' | 'half' | 'empty'
  gradientId: string
}

function StarIcon({ fill, gradientId }: StarIconProps) {
  const starPath =
    'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'

  if (fill === 'half') {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="size-full"
        fill="currentColor"
      >
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path fill={`url(#${gradientId})`} d={starPath} />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          d={starPath}
        />
      </svg>
    )
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="size-full"
      fill={fill === 'full' ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={fill === 'empty' ? 1 : 0}
    >
      <path d={starPath} />
    </svg>
  )
}

export function StarRating({
  rating,
  maxRating = 5,
  reviewCount,
  size = 'md',
  className = '',
}: StarRatingProps) {
  const baseId = useId()
  const clamped = clampRating(rating, maxRating)
  const sizeClass = size === 'sm' ? 'size-3.5' : 'size-4'

  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starValue = index + 1
    if (starValue <= Math.floor(clamped)) return 'full' as const
    if (starValue - clamped < 1 && clamped % 1 !== 0) return 'half' as const
    return 'empty' as const
  })

  const label =
    reviewCount !== undefined
      ? `${clamped.toFixed(1)} out of ${maxRating} stars, ${reviewCount.toLocaleString()} reviews`
      : `${clamped.toFixed(1)} out of ${maxRating} stars`

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        role="img"
        aria-label={label}
        className={`flex text-amber-400 ${sizeClass}`}
      >
        {stars.map((fill, index) => (
          <span key={index} className={sizeClass}>
            <StarIcon fill={fill} gradientId={`${baseId}-star-${index}`} />
          </span>
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-slate-400 sm:text-sm" aria-hidden="true">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  )
}
