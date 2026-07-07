import { useState } from 'react'
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters'
import { ChartPlaceholder } from '@/components/analytics/ChartPlaceholder'
import { DataTable } from '@/components/analytics/DataTable'
import { DonutChartPlaceholder } from '@/components/analytics/DonutChartPlaceholder'
import { KpiCard } from '@/components/analytics/KpiCard'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import {
  analyticsTableData,
  categoryBreakdown,
  kpiMetrics,
  revenueChartData,
  trafficChartData,
} from '@/data/analyticsData'
import { sidebarNavItems } from '@/data/sampleTasks'

const dashboardUser = {
  name: 'Jordan Lee',
  email: 'jordan@example.com',
  avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Jordan',
}

const analyticsSidebarItems = sidebarNavItems.map((item) => ({
  ...item,
  isActive: item.id === 'dashboard',
}))

export function AnalyticsDashboardPage() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Monitor performance metrics and campaign data"
      user={dashboardUser}
      sidebarItems={analyticsSidebarItems}
    >
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
        {/* Filters */}
        <AnalyticsFilters
          onApply={(filters) =>
            setFilterStatus(
              `Filters applied: ${filters.datePreset}, ${filters.category}, ${filters.region}`,
            )
          }
          onReset={() => setFilterStatus(null)}
        />

        {filterStatus && (
          <p
            role="status"
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300"
          >
            {filterStatus}
          </p>
        )}

        {/* KPI cards */}
        <section aria-labelledby="kpi-heading">
          <h2 id="kpi-heading" className="sr-only">
            Key performance indicators
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpiMetrics.map((metric) => (
              <KpiCard key={metric.id} metric={metric} />
            ))}
          </div>
        </section>

        {/* Charts row 1 */}
        <section aria-labelledby="charts-heading" className="grid gap-4 lg:grid-cols-5 lg:gap-6">
          <h2 id="charts-heading" className="sr-only">
            Charts
          </h2>
          <ChartPlaceholder
            title="Revenue over time"
            subtitle="Monthly revenue trend (USD)"
            type="area"
            series={revenueChartData}
            className="lg:col-span-3"
          />
          <DonutChartPlaceholder
            title="Sales by category"
            items={categoryBreakdown}
            className="lg:col-span-2"
          />
        </section>

        {/* Charts row 2 */}
        <section aria-labelledby="traffic-heading" className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          <h2 id="traffic-heading" className="sr-only">
            Traffic charts
          </h2>
          <ChartPlaceholder
            title="Traffic sources"
            subtitle="Sessions by acquisition channel"
            type="line"
            series={trafficChartData}
          />
          <ChartPlaceholder
            title="Conversion funnel"
            subtitle="Monthly conversion volume"
            type="bar"
            series={{ label: 'Conversions', values: [320, 380, 410, 395, 450, 480, 520, 490, 540, 580, 560, 620] }}
          />
        </section>

        {/* Data table */}
        <section aria-labelledby="table-heading">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="table-heading"
                className="text-lg font-semibold text-slate-900 dark:text-white"
              >
                Campaign performance
              </h2>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Detailed breakdown by campaign and date
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
          </div>
          <DataTable rows={analyticsTableData} />
        </section>
      </div>
    </DashboardLayout>
  )
}
