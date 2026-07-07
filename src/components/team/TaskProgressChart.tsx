import { statusChartColors } from '@/data/teamData'

export interface TaskProgressChartProps {
  statusCounts: { label: string; value: number }[]
}

export function TaskProgressChart({ statusCounts }: TaskProgressChartProps) {
  const total = statusCounts.reduce((sum, item) => sum + item.value, 0)
  const maxValue = Math.max(...statusCounts.map((s) => s.value), 1)

  return (
    <section
      aria-labelledby="progress-chart-heading"
      data-testid="task-progress-chart"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
    >
      <h2
        id="progress-chart-heading"
        className="mb-4 text-sm font-semibold text-slate-900 dark:text-white"
      >
        Task progress
      </h2>

      {total === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No tasks yet. Create one to see progress.
        </p>
      ) : (
        <>
          <div
            role="img"
            aria-label={`Task breakdown: ${statusCounts.map((s) => `${s.label} ${s.value}`).join(', ')}`}
            className="space-y-3"
          >
            {statusCounts.map((item) => {
              const pct = Math.round((item.value / total) * 100)
              const barWidth = (item.value / maxValue) * 100
              const color = statusChartColors[item.label] ?? 'bg-slate-400'

              return (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item.label}
                    </span>
                    <span className="tabular-nums text-slate-500 dark:text-slate-400">
                      {item.value} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${color}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            {statusCounts.map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400"
              >
                <span
                  aria-hidden="true"
                  className={`size-2.5 rounded-full ${statusChartColors[item.label] ?? 'bg-slate-400'}`}
                />
                {item.label}
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
