import { useCallback, useMemo, useState } from 'react'
import type { Task, TaskStatus } from '@/data/sampleTasks'
import { KanbanColumn, type KanbanColumnConfig } from '@/components/kanban/KanbanColumn'

export interface KanbanBoardProps {
  tasks: Task[]
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void
  className?: string
}

const columns: (KanbanColumnConfig & { targetStatus: TaskStatus; matchStatuses: TaskStatus[] })[] = [
  {
    id: 'todo',
    title: 'To Do',
    accentClass: 'bg-slate-400',
    targetStatus: 'todo',
    matchStatuses: ['todo'],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    accentClass: 'bg-indigo-500',
    targetStatus: 'in-progress',
    matchStatuses: ['in-progress', 'review'],
  },
  {
    id: 'done',
    title: 'Done',
    accentClass: 'bg-emerald-500',
    targetStatus: 'done',
    matchStatuses: ['done'],
  },
]

export function KanbanBoard({ tasks, onMoveTask, className = '' }: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null)

  const tasksByColumn = useMemo(() => {
    const grouped: Record<string, Task[]> = {}
    for (const col of columns) {
      grouped[col.id] = tasks.filter((t) => col.matchStatuses.includes(t.status))
    }
    return grouped
  }, [tasks])

  const handleDragStart = useCallback((taskId: string) => {
    setDraggedTaskId(taskId)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedTaskId(null)
    setDragOverColumnId(null)
  }, [])

  const handleDrop = useCallback(
    (columnId: string) => {
      if (!draggedTaskId) return
      const column = columns.find((c) => c.id === columnId)
      if (!column) return

      const task = tasks.find((t) => t.id === draggedTaskId)
      if (task && !column.matchStatuses.includes(task.status)) {
        onMoveTask(draggedTaskId, column.targetStatus)
      }

      setDraggedTaskId(null)
      setDragOverColumnId(null)
    },
    [draggedTaskId, tasks, onMoveTask],
  )

  return (
    <div
      data-testid="kanban-board"
      data-kanban-board
      className={`grid gap-4 md:grid-cols-3 lg:gap-6 ${className}`}
    >
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          tasks={tasksByColumn[column.id]}
          draggedTaskId={draggedTaskId}
          isDragOver={dragOverColumnId === column.id}
          onDragOver={setDragOverColumnId}
          onDragLeave={() => setDragOverColumnId(null)}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  )
}
