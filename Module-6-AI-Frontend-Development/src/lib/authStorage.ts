export interface StoredUser {
  id: string
  name: string
  email: string
  password: string
}

const USERS_KEY = 'taskflow-users'
const SESSION_KEY = 'taskflow-session'

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as StoredUser[]) : []
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getSessionUserId(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function setSessionUserId(userId: string) {
  localStorage.setItem(SESSION_KEY, userId)
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function registerUser(
  name: string,
  email: string,
  password: string,
): { user?: StoredUser; error?: string } {
  const users = readUsers()
  const normalizedEmail = email.trim().toLowerCase()

  if (users.some((user) => user.email === normalizedEmail)) {
    return { error: 'An account with this email already exists.' }
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    password,
  }

  users.push(user)
  writeUsers(users)
  setSessionUserId(user.id)
  return { user }
}

export function loginUser(
  email: string,
  password: string,
): { user?: StoredUser; error?: string } {
  const users = readUsers()
  const normalizedEmail = email.trim().toLowerCase()
  const user = users.find(
    (entry) => entry.email === normalizedEmail && entry.password === password,
  )

  if (!user) {
    return { error: 'Invalid email or password.' }
  }

  setSessionUserId(user.id)
  return { user }
}

export function getUserById(userId: string): StoredUser | null {
  return readUsers().find((user) => user.id === userId) ?? null
}

export function logoutUser() {
  clearSession()
}

/** Clears all app data — used by E2E tests for isolation. */
export function resetAppStorage() {
  const keys = Object.keys(localStorage).filter(
    (key) => key.startsWith('taskflow-'),
  )
  keys.forEach((key) => localStorage.removeItem(key))
}
