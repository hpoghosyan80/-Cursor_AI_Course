import type { KpiMetric } from '@/data/analyticsData'

export interface KpiCardProps {
  metric: KpiMetric
}

const trendStyles = {
  up: 'text-emerald-600 dark:text-emerald-400',
  down: 'text-rose-600 dark:text-rose-400',
  neutral: 'text-slate-500 dark:text-slate-400',
}

const iconPaths: Record<KpiMetric['icon'], string> = {
  revenue:
    'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  users:
    'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  sessions:
    'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  conversion:
    'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
}

const iconBg: Record<KpiMetric['icon'], string> = {
  revenue: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400',
  users: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400',
  sessions: 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400',
  conversion: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
}

function MiniSparkline({ trend }: { trend: KpiMetric['trend'] }) {
  const stroke =
    trend === 'up'
      ? 'stroke-emerald-500'
      : trend === 'down'
        ? 'stroke-rose-500'
        : 'stroke-slate-400'

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 24"
      className={`h-6 w-20 ${stroke}`}
      fill="none"
      strokeWidth={2}
    >
      {trend === 'down' ? (
        <path d="M0 4 L20 8 L40 6 L60 14 L80 20" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M0 20 L20 16 L40 18 L60 10 L80 4" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  )
}

export function KpiCard({ metric }: KpiCardProps) {
  return (
    <article
      aria-label={`${metric.label}: ${metric.value}, ${metric.change}`}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          aria-hidden="true"
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconBg[metric.icon]}`}
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[metric.icon]} />
          </svg>
        </div>
        <MiniSparkline trend={metric.trend} />
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        {metric.label}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
        {metric.value}
      </p>
      <p className={`mt-2 flex items-center gap-1 text-xs font-medium sm:text-sm ${trendStyles[metric.trend]}`}>
        {metric.trend === 'up' && (
          <svg aria-hidden="true" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        )}
        {metric.trend === 'down' && (
          <svg aria-hidden="true" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )}
        {metric.change}
      </p>
    </article>
  )
}
