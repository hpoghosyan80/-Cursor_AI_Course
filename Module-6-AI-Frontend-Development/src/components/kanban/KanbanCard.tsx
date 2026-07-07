import type { Task, TaskPriority } from '@/data/sampleTasks'

export interface KanbanCardProps {
  task: Task
  onDragStart?: (taskId: string) => void
  onDragEnd?: () => void
  isDragging?: boolean
}

const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
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

export function KanbanCard({
  task,
  onDragStart,
  onDragEnd,
  isDragging = false,
}: KanbanCardProps) {
  const isOverdue =
    task.status !== 'done' && new Date(task.dueDate) < new Date()

  return (
    <article
      draggable
      data-testid="kanban-card"
      data-task-id={task.id}
      data-kanban-card
      aria-grabbed={isDragging}
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', task.id)
        event.dataTransfer.effectAllowed = 'move'
        onDragStart?.(task.id)
      }}
      onDragEnd={onDragEnd}
      className={`group cursor-grab rounded-lg border bg-white p-3 shadow-sm transition-all duration-200 active:cursor-grabbing dark:bg-slate-900 ${
        isDragging
          ? 'scale-95 border-indigo-400 opacity-50 shadow-none ring-2 ring-indigo-400/30'
          : 'border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:hover:border-slate-600'
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>

        {/* Drag handle — visual affordance; whole card is draggable */}
        <button
          type="button"
          data-kanban-drag-handle
          aria-label={`Drag task ${task.title}`}
          className="shrink-0 rounded p-0.5 text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-600 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 group-hover:opacity-100 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <svg aria-hidden="true" className="size-4" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="4" r="1.2" />
            <circle cx="11" cy="4" r="1.2" />
            <circle cx="5" cy="8" r="1.2" />
            <circle cx="11" cy="8" r="1.2" />
            <circle cx="5" cy="12" r="1.2" />
            <circle cx="11" cy="12" r="1.2" />
          </svg>
        </button>
      </div>

      <h3
        data-testid="kanban-card-title"
        className={`text-sm font-semibold leading-snug text-slate-900 dark:text-white ${task.status === 'done' ? 'line-through opacity-70' : ''}`}
      >
        {task.title}
      </h3>

      <footer className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 dark:border-slate-800">
        <time
          dateTime={task.dueDate}
          className={`text-[11px] font-medium ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {isOverdue ? 'Overdue · ' : ''}
          {formatDueDate(task.dueDate)}
        </time>

        {task.assignee ? (
          <div className="flex items-center gap-1.5" title={task.assignee.name}>
            {task.assignee.avatarUrl ? (
              <img
                src={task.assignee.avatarUrl}
                alt=""
                className="size-6 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-6 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-semibold text-white"
              >
                {getInitials(task.assignee.name)}
              </span>
            )}
            <span className="hidden max-w-[4rem] truncate text-[11px] text-slate-600 dark:text-slate-400 sm:inline">
              {task.assignee.name.split(' ')[0]}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Unassigned</span>
        )}
      </footer>
    </article>
  )
}
