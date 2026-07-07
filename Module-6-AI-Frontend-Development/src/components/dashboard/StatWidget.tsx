import type { DashboardStat } from '@/data/sampleTasks'

export interface StatWidgetProps {
  stat: DashboardStat
}

const trendStyles = {
  up: 'text-emerald-600 dark:text-emerald-400',
  down: 'text-rose-600 dark:text-rose-400',
  neutral: 'text-slate-500 dark:text-slate-400',
}

export function StatWidget({ stat }: StatWidgetProps) {
  return (
    <article
      aria-label={`${stat.label}: ${stat.value}`}
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 sm:p-5"
    >
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {stat.label}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-white sm:text-3xl">
        {stat.value}
      </p>
      {stat.change && (
        <p
          className={`mt-2 text-xs sm:text-sm ${trendStyles[stat.trend ?? 'neutral']}`}
        >
          {stat.change}
        </p>
      )}
    </article>
  )
}
