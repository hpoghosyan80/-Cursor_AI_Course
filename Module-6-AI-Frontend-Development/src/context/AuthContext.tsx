import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getSessionUserId,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
  type StoredUser,
} from '@/lib/authStorage'

interface AuthContextValue {
  user: StoredUser | null
  isAuthenticated: boolean
  register: (
    name: string,
    email: string,
    password: string,
  ) => { error?: string }
  login: (email: string, password: string) => { error?: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(() => {
    const sessionId = getSessionUserId()
    return sessionId ? getUserById(sessionId) : null
  })

  const register = useCallback((name: string, email: string, password: string) => {
    const result = registerUser(name, email, password)
    if (result.user) setUser(result.user)
    return { error: result.error }
  }, [])

  const login = useCallback((email: string, password: string) => {
    const result = loginUser(email, password)
    if (result.user) setUser(result.user)
    return { error: result.error }
  }, [])

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      register,
      login,
      logout,
    }),
    [user, register, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
