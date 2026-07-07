import type { Task, TaskPriority, TaskStatus } from '@/data/sampleTasks'

export interface TaskCardProps {
  task: Task
  onStatusChange?: (taskId: string, status: TaskStatus) => void
  onDelete?: (taskId: string) => void
}

const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

const statusLabels: Record<TaskStatus, string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  review: 'In review',
  done: 'Done',
}

const statusStyles: Record<TaskStatus, string> = {
  todo: 'border-slate-200 dark:border-slate-700',
  'in-progress': 'border-indigo-300 dark:border-indigo-700',
  review: 'border-amber-300 dark:border-amber-700',
  done: 'border-emerald-300 dark:border-emerald-800 opacity-80',
}

function formatDueDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const isOverdue =
    task.status !== 'done' && new Date(task.dueDate) < new Date()

  return (
    <article
      aria-labelledby={`task-title-${task.id}`}
      data-testid="task-card"
      data-task-id={task.id}
      data-task-title={task.title}
      className={`flex flex-col rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/80 sm:p-5 ${statusStyles[task.status]}`}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${priorityStyles[task.priority]}`}
          >
            {task.priority}
          </span>
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor={`status-${task.id}`} className="sr-only">
            Status for {task.title}
          </label>
          <select
            id={`status-${task.id}`}
            data-testid="task-status-select"
            value={task.status}
            onChange={(event) =>
              onStatusChange?.(task.id, event.target.value as TaskStatus)
            }
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            aria-label={`Change status for ${task.title}`}
          >
            {(Object.keys(statusLabels) as TaskStatus[]).map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>

          {onDelete && (
            <button
              type="button"
              data-testid="task-delete-button"
              onClick={() => onDelete(task.id)}
              aria-label={`Delete task ${task.title}`}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
            >
              <svg
                aria-hidden="true"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <h3
        id={`task-title-${task.id}`}
        data-testid="task-card-title"
        className={`text-base font-semibold text-slate-900 dark:text-white sm:text-lg ${task.status === 'done' ? 'line-through' : ''}`}
      >
        {task.title}
      </h3>

      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {task.description}
      </p>

      <footer className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <time
          dateTime={task.dueDate}
          className={`text-xs font-medium sm:text-sm ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {isOverdue ? 'Overdue · ' : 'Due '}
          {formatDueDate(task.dueDate)}
        </time>

        {task.assignee && (
          <div className="flex items-center gap-2">
            {task.assignee.avatarUrl ? (
              <img
                src={task.assignee.avatarUrl}
                alt=""
                className="size-7 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-7 items-center justify-center rounded-full bg-indigo-500 text-xs font-semibold text-white"
              >
                {getInitials(task.assignee.name)}
              </span>
            )}
            <span className="hidden text-xs text-slate-600 dark:text-slate-300 sm:inline">
              {task.assignee.name}
            </span>
          </div>
        )}
      </footer>
    </article>
  )
}
