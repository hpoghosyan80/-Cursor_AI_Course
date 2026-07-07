import type { Task, TaskPriority, TaskStatus } from '@/data/sampleTasks'

function tasksKey(userId: string) {
  return `taskflow-tasks-${userId}`
}

export function loadTasks(userId: string): Task[] {
  try {
    const raw = localStorage.getItem(tasksKey(userId))
    return raw ? (JSON.parse(raw) as Task[]) : []
  } catch {
    return []
  }
}

export function saveTasks(userId: string, tasks: Task[]) {
  localStorage.setItem(tasksKey(userId), JSON.stringify(tasks))
}

export function createTask(
  userId: string,
  input: {
    title: string
    description: string
    priority: TaskPriority
    dueDate: string
    tags?: string[]
  },
): Task {
  const tasks = loadTasks(userId)
  const task: Task = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description.trim(),
    priority: input.priority,
    status: 'todo',
    dueDate: input.dueDate,
    tags: input.tags ?? [],
  }
  saveTasks(userId, [...tasks, task])
  return task
}

export function updateTaskStatus(
  userId: string,
  taskId: string,
  status: TaskStatus,
): Task[] {
  const tasks = loadTasks(userId).map((task) =>
    task.id === taskId ? { ...task, status } : task,
  )
  saveTasks(userId, tasks)
  return tasks
}

export function deleteTask(userId: string, taskId: string): Task[] {
  const tasks = loadTasks(userId).filter((task) => task.id !== taskId)
  saveTasks(userId, tasks)
  return tasks
}
