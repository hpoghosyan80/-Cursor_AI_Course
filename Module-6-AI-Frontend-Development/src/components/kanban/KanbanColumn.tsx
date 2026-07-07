import type { ReactNode } from 'react'
import type { Task } from '@/data/sampleTasks'
import { KanbanCard } from '@/components/kanban/KanbanCard'

export interface KanbanColumnConfig {
  id: string
  title: string
  accentClass: string
}

export interface KanbanColumnProps {
  column: KanbanColumnConfig
  tasks: Task[]
  draggedTaskId: string | null
  isDragOver: boolean
  onDragOver: (columnId: string) => void
  onDragLeave: () => void
  onDrop: (columnId: string) => void
  onDragStart: (taskId: string) => void
  onDragEnd: () => void
  emptyPlaceholder?: ReactNode
}

export function KanbanColumn({
  column,
  tasks,
  draggedTaskId,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onDragEnd,
  emptyPlaceholder,
}: KanbanColumnProps) {
  return (
    <section
      aria-labelledby={`kanban-col-${column.id}`}
      data-testid={`kanban-column-${column.id}`}
      data-kanban-column={column.id}
      className={`flex min-h-[20rem] flex-col rounded-xl border transition-all duration-200 sm:min-h-[24rem] ${
        isDragOver
          ? 'border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-400/30 dark:border-indigo-600 dark:bg-indigo-950/20'
          : 'border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/40'
      }`}
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
        onDragOver(column.id)
      }}
      onDragLeave={onDragLeave}
      onDrop={(event) => {
        event.preventDefault()
        onDrop(column.id)
      }}
    >
      {/* Column header */}
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className={`size-2.5 rounded-full ${column.accentClass}`} />
          <h2
            id={`kanban-col-${column.id}`}
            className="text-sm font-semibold text-slate-900 dark:text-white"
          >
            {column.title}
          </h2>
        </div>
        <span
          data-testid={`kanban-column-count-${column.id}`}
          className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-400"
        >
          {tasks.length}
        </span>
      </header>

      {/* Drop zone */}
      <div
        data-kanban-dropzone
        role="list"
        aria-label={`${column.title} tasks`}
        className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-3"
      >
        {tasks.length === 0 ? (
          <div
            data-kanban-drop-placeholder
            className={`flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
              isDragOver
                ? 'border-indigo-400 bg-indigo-50 text-indigo-600 dark:border-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400'
                : 'border-slate-200 text-slate-400 dark:border-slate-700 dark:text-slate-500'
            }`}
          >
            {isDragOver ? (
              <p className="text-sm font-medium">Drop task here</p>
            ) : (
              emptyPlaceholder ?? (
                <>
                  <p className="text-sm font-medium">No tasks</p>
                  <p className="mt-1 text-xs">Drag a card here</p>
                </>
              )
            )}
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              isDragging={draggedTaskId === task.id}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}

        {/* Drop indicator at bottom when column has cards */}
        {tasks.length > 0 && isDragOver && (
          <div
            data-kanban-drop-placeholder
            aria-hidden="true"
            className="h-16 rounded-lg border-2 border-dashed border-indigo-400 bg-indigo-50/50 dark:border-indigo-600 dark:bg-indigo-950/20"
          />
        )}
      </div>
    </section>
  )
}
