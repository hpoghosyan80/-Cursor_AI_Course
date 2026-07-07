import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Activity } from '@/data/teamData'
import type { Task, TaskPriority, TaskStatus } from '@/data/sampleTasks'
import { addActivity, loadActivities } from '@/lib/activityStorage'
import {
  createTask as createStoredTask,
  deleteTask as deleteStoredTask,
  loadTasks,
  updateTaskStatus as updateStoredTaskStatus,
} from '@/lib/taskStorage'
import { useAuth } from '@/context/AuthContext'

interface TaskContextValue {
  tasks: Task[]
  activities: Activity[]
  createTask: (input: {
    title: string
    description: string
    priority: TaskPriority
    dueDate: string
    tags?: string[]
  }) => { error?: string }
  updateTaskStatus: (taskId: string, status: TaskStatus) => void
  deleteTask: (taskId: string) => void
  addNote: (message: string) => void
}

const TaskContext = createContext<TaskContextValue | null>(null)

const statusLabels: Record<TaskStatus, string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  review: 'In review',
  done: 'Done',
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    if (user) {
      setTasks(loadTasks(user.id))
      setActivities(loadActivities(user.id))
    } else {
      setTasks([])
      setActivities([])
    }
  }, [user])

  const logActivity = useCallback(
    (entry: Omit<Activity, 'id' | 'timestamp' | 'userId' | 'userName'>) => {
      if (!user) return
      setActivities(
        addActivity(user.id, {
          ...entry,
          userId: user.id,
          userName: user.name,
        }),
      )
    },
    [user],
  )

  const createTask = useCallback(
    (input: {
      title: string
      description: string
      priority: TaskPriority
      dueDate: string
      tags?: string[]
    }) => {
      if (!user) return { error: 'You must be logged in to create tasks.' }
      if (!input.title.trim()) return { error: 'Task title is required.' }

      const task = createStoredTask(user.id, input)
      setTasks((prev) => [...prev, task])
      logActivity({
        type: 'task_created',
        message: 'created a task',
        taskTitle: task.title,
      })
      return {}
    },
    [user, logActivity],
  )

  const updateTaskStatus = useCallback(
    (taskId: string, status: TaskStatus) => {
      if (!user) return
      const task = tasks.find((t) => t.id === taskId)
      setTasks(updateStoredTaskStatus(user.id, taskId, status))
      if (task) {
        logActivity({
          type: status === 'done' ? 'task_completed' : 'task_updated',
          message: status === 'done' ? 'completed a task' : `moved a task to ${statusLabels[status]}`,
          taskTitle: task.title,
        })
      }
    },
    [user, tasks, logActivity],
  )

  const deleteTask = useCallback(
    (taskId: string) => {
      if (!user) return
      const task = tasks.find((t) => t.id === taskId)
      setTasks(deleteStoredTask(user.id, taskId))
      if (task) {
        logActivity({
          type: 'task_deleted',
          message: 'deleted a task',
          taskTitle: task.title,
        })
      }
    },
    [user, tasks, logActivity],
  )

  const addNote = useCallback(
    (message: string) => {
      if (!user || !message.trim()) return
      logActivity({ type: 'comment', message: `added a note: "${message.trim()}"` })
    },
    [user, logActivity],
  )

  const value = useMemo(
    () => ({ tasks, activities, createTask, updateTaskStatus, deleteTask, addNote }),
    [tasks, activities, createTask, updateTaskStatus, deleteTask, addNote],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) throw new Error('useTasks must be used within TaskProvider')
  return context
}
