import { useId, useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  categoryOptions,
  dateRangePresets,
  regionOptions,
  type DateRangePreset,
} from '@/data/analyticsData'

export interface AnalyticsFiltersProps {
  onApply?: (filters: AnalyticsFilterState) => void
  onReset?: () => void
}

export interface AnalyticsFilterState {
  datePreset: DateRangePreset
  startDate: string
  endDate: string
  category: string
  region: string
}

const defaultFilters: AnalyticsFilterState = {
  datePreset: '30d',
  startDate: '2026-06-07',
  endDate: '2026-07-07',
  category: 'all',
  region: 'global',
}

export function AnalyticsFilters({ onApply, onReset }: AnalyticsFiltersProps) {
  const [filters, setFilters] = useState<AnalyticsFilterState>(defaultFilters)
  const formId = useId()

  const handlePreset = (preset: DateRangePreset) => {
    setFilters((prev) => ({ ...prev, datePreset: preset }))
  }

  const handleReset = () => {
    setFilters(defaultFilters)
    onReset?.()
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onApply?.(filters)
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      aria-label="Analytics filters"
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        {/* Date range presets */}
        <fieldset className="min-w-0 flex-1">
          <legend className="mb-2 text-sm font-medium text-slate-900 dark:text-white">
            Date range
          </legend>
          <div
            role="group"
            aria-label="Date range presets"
            className="flex flex-wrap gap-1.5"
          >
            {dateRangePresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                aria-pressed={filters.datePreset === preset.id}
                onClick={() => handlePreset(preset.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                  filters.datePreset === preset.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {filters.datePreset === 'custom' && (
            <div className="mt-3 flex flex-wrap gap-3">
              <div className="min-w-0 flex-1">
                <label
                  htmlFor={`${formId}-start`}
                  className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  Start date
                </label>
                <input
                  id={`${formId}-start`}
                  type="date"
                  value={filters.startDate}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, startDate: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
              <div className="min-w-0 flex-1">
                <label
                  htmlFor={`${formId}-end`}
                  className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  End date
                </label>
                <input
                  id={`${formId}-end`}
                  type="date"
                  value={filters.endDate}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, endDate: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          )}
        </fieldset>

        {/* Dropdowns */}
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <div className="min-w-[10rem] flex-1 sm:flex-none">
            <label
              htmlFor={`${formId}-category`}
              className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
            >
              Category
            </label>
            <select
              id={`${formId}-category`}
              value={filters.category}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, category: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[10rem] flex-1 sm:flex-none">
            <label
              htmlFor={`${formId}-region`}
              className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400"
            >
              Region
            </label>
            <select
              id={`${formId}-region`}
              value={filters.region}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, region: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {regionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 lg:pb-0.5">
          <Button type="button" variant="secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit">Apply filters</Button>
        </div>
      </div>
    </form>
  )
}

export { defaultFilters }
