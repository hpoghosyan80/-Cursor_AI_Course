import type { Activity, ActivityType } from '@/data/teamData'

export interface ActivityFeedProps {
  activities: Activity[]
  maxItems?: number
}

const activityIcons: Record<ActivityType, string> = {
  task_created: '✚',
  task_completed: '✓',
  task_updated: '↻',
  task_deleted: '✕',
  comment: '💬',
  member_joined: '👋',
}

const activityColors: Record<ActivityType, string> = {
  task_created: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400',
  task_completed: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  task_updated: 'bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400',
  task_deleted: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
  comment: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400',
  member_joined: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function ActivityFeed({ activities, maxItems = 8 }: ActivityFeedProps) {
  const items = activities.slice(0, maxItems)

  return (
    <section
      aria-labelledby="activity-feed-heading"
      data-testid="activity-feed"
      className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
    >
      <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <h2
          id="activity-feed-heading"
          className="text-sm font-semibold text-slate-900 dark:text-white"
        >
          Recent activity
        </h2>
      </div>

      {items.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No activity yet.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800" role="list">
          {items.map((activity) => (
            <li key={activity.id} className="flex gap-3 px-5 py-3.5">
              <span
                aria-hidden="true"
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm ${activityColors[activity.type]}`}
              >
                {activityIcons[activity.type]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {activity.userName}
                  </span>{' '}
                  {activity.message}
                  {activity.taskTitle && (
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      {' '}
                      &ldquo;{activity.taskTitle}&rdquo;
                    </span>
                  )}
                </p>
                <time
                  dateTime={activity.timestamp}
                  className="mt-0.5 block text-xs text-slate-400"
                >
                  {timeAgo(activity.timestamp)}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
