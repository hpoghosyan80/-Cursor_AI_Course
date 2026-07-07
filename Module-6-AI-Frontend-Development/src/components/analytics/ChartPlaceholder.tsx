import type { ChartSeries } from '@/data/analyticsData'

export interface ChartPlaceholderProps {
  title: string
  subtitle?: string
  type?: 'line' | 'bar' | 'area'
  series?: ChartSeries | ChartSeries[]
  className?: string
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function normalize(values: number[]): { x: number; y: number }[] {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  return values.map((value, index) => ({
    x: (index / (values.length - 1)) * 100,
    y: 100 - ((value - min) / range) * 80 - 10,
  }))
}

function toPath(points: { x: number; y: number }[]): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
}

function toAreaPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  const line = toPath(points)
  return `${line} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`
}

const seriesColors = [
  { stroke: 'stroke-indigo-500', fill: 'fill-indigo-500/10', bar: 'bg-indigo-500' },
  { stroke: 'stroke-violet-500', fill: 'fill-violet-500/10', bar: 'bg-violet-500' },
  { stroke: 'stroke-sky-500', fill: 'fill-sky-500/10', bar: 'bg-sky-500' },
]

export function ChartPlaceholder({
  title,
  subtitle,
  type = 'line',
  series,
  className = '',
}: ChartPlaceholderProps) {
  const allSeries: ChartSeries[] = series
    ? Array.isArray(series)
      ? series
      : [series]
    : [{ label: 'Data', values: [40, 55, 45, 60, 58, 72, 68, 85, 80, 92, 88, 98] }]

  return (
    <figure
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-5 ${className}`}
    >
      <figcaption className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>
        {allSeries.length > 1 && (
          <ul className="flex flex-wrap gap-3" aria-label="Chart legend">
            {allSeries.map((s, i) => (
              <li key={s.label} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span
                  aria-hidden="true"
                  className={`size-2.5 rounded-full ${seriesColors[i % seriesColors.length].bar}`}
                />
                {s.label}
              </li>
            ))}
          </ul>
        )}
      </figcaption>

      <div
        role="img"
        aria-label={`${title} chart placeholder showing ${allSeries.map((s) => s.label).join(', ')}`}
        className="relative"
      >
        {type === 'bar' ? (
          <div className="flex h-48 items-end gap-1 sm:h-56 sm:gap-1.5">
            {allSeries[0].values.map((value, index) => {
              const max = Math.max(...allSeries[0].values)
              const height = (value / max) * 100
              return (
                <div key={index} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-sm ${seriesColors[0].bar} opacity-80 transition-all duration-300 hover:opacity-100`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="hidden text-[10px] text-slate-400 sm:block">
                    {MONTHS[index]}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-48 w-full sm:h-56"
            aria-hidden="true"
          >
            {allSeries.map((s, seriesIndex) => {
              const points = normalize(s.values)
              const colors = seriesColors[seriesIndex % seriesColors.length]
              return (
                <g key={s.label}>
                  {type === 'area' && (
                    <path d={toAreaPath(points)} className={colors.fill} />
                  )}
                  <path
                    d={toPath(points)}
                    fill="none"
                    className={colors.stroke}
                    strokeWidth={1.5}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              )
            })}
          </svg>
        )}

        {/* X-axis labels for line/area */}
        {type !== 'bar' && (
          <div className="mt-2 flex justify-between text-[10px] text-slate-400 sm:text-xs">
            {MONTHS.filter((_, i) => i % 2 === 0).map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        )}
      </div>
    </figure>
  )
}
