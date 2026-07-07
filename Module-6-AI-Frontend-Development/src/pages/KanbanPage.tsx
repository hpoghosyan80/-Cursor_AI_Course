import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { TaskFormModal } from '@/components/dashboard/TaskFormModal'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { useAuth } from '@/context/AuthContext'
import { useTasks } from '@/context/TaskContext'
import { sidebarNavItems } from '@/data/sampleTasks'

export function KanbanPage() {
  const { user, logout } = useAuth()
  const { tasks, createTask, updateTaskStatus } = useTasks()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const boardSidebarItems = sidebarNavItems.map((item) => ({
    ...item,
    href: item.id === 'dashboard' ? '/dashboard' : item.id === 'tasks' ? '/board' : item.href,
    isActive: item.id === 'tasks',
  }))

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <DashboardLayout
      title="Kanban Board"
      subtitle="Drag tasks between columns to update status"
      user={{ name: user.name, email: user.email }}
      sidebarItems={boardSidebarItems}
      onLogout={handleLogout}
    >
      <div className="mx-auto max-w-7xl space-y-4 p-4 sm:space-y-6 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} across 3 columns
          </p>
          <Button data-testid="kanban-new-task" onClick={() => setIsModalOpen(true)}>
            + New task
          </Button>
        </div>

        <KanbanBoard tasks={tasks} onMoveTask={updateTaskStatus} />

        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          Drag-and-drop uses native HTML5 events — swap in{' '}
          <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">@dnd-kit/core</code>{' '}
          via the <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">data-kanban-*</code>{' '}
          hooks for advanced interactions.
        </p>
      </div>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createTask}
      />
    </DashboardLayout>
  )
}
