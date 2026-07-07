export interface DonutChartPlaceholderProps {
  title: string
  items: { label: string; value: number; color: string }[]
  className?: string
}

export function DonutChartPlaceholder({
  title,
  items,
  className = '',
}: DonutChartPlaceholderProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0)

  let cumulative = 0
  const segments = items.map((item) => {
    const start = (cumulative / total) * 360
    cumulative += item.value
    const end = (cumulative / total) * 360
    return { ...item, start, end, percentage: Math.round((item.value / total) * 100) }
  })

  function polarToCartesian(angle: number, radius: number) {
    const rad = ((angle - 90) * Math.PI) / 180
    return { x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad) }
  }

  function describeArc(startAngle: number, endAngle: number, radius: number) {
    const start = polarToCartesian(startAngle, radius)
    const end = polarToCartesian(endAngle, radius)
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
  }

  const colorMap: Record<string, string> = {
    'bg-indigo-500': '#6366f1',
    'bg-violet-500': '#8b5cf6',
    'bg-fuchsia-500': '#d946ef',
    'bg-sky-500': '#0ea5e9',
  }

  return (
    <figure
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-5 ${className}`}
    >
      <figcaption className="mb-4 text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
        {title}
      </figcaption>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="img"
          aria-label={`${title}: ${items.map((i) => `${i.label} ${Math.round((i.value / total) * 100)}%`).join(', ')}`}
          className="relative size-40 shrink-0"
        >
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            {segments.map((segment) => (
              <path
                key={segment.label}
                d={describeArc(segment.start, segment.end - 0.5, 40)}
                fill="none"
                stroke={colorMap[segment.color] ?? '#6366f1'}
                strokeWidth={12}
                strokeLinecap="round"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{total}%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Total share</span>
          </div>
        </div>

        <ul className="w-full space-y-2.5 sm:w-auto sm:min-w-[10rem]" aria-label="Category legend">
          {segments.map((item) => (
            <li key={item.label} className="flex items-center justify-between gap-4 text-sm">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span aria-hidden="true" className={`size-2.5 rounded-full ${item.color}`} />
                {item.label}
              </span>
              <span className="font-medium tabular-nums text-slate-900 dark:text-white">
                {item.percentage}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}
