import type { AnalyticsTableRow } from '@/data/analyticsData'

export interface DataTableProps {
  rows: AnalyticsTableRow[]
  caption?: string
}

const statusStyles: Record<AnalyticsTableRow['status'], string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  completed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
}

function formatNumber(value: number): string {
  return value.toLocaleString()
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function DataTable({ rows, caption = 'Campaign performance data' }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
              {['Date', 'Campaign', 'Impressions', 'Clicks', 'CTR', 'Revenue', 'Status'].map(
                (header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:px-5"
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row) => (
              <tr
                key={row.id}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="whitespace-nowrap px-4 py-3.5 tabular-nums text-slate-600 dark:text-slate-300 sm:px-5">
                  <time dateTime={row.date}>{formatDate(row.date)}</time>
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white sm:px-5">
                  {row.campaign}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 tabular-nums text-slate-600 dark:text-slate-300 sm:px-5">
                  {formatNumber(row.impressions)}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 tabular-nums text-slate-600 dark:text-slate-300 sm:px-5">
                  {formatNumber(row.clicks)}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 tabular-nums text-slate-600 dark:text-slate-300 sm:px-5">
                  {row.ctr.toFixed(2)}%
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 tabular-nums font-medium text-slate-900 dark:text-white sm:px-5">
                  {formatCurrency(row.revenue)}
                </td>
                <td className="px-4 py-3.5 sm:px-5">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
