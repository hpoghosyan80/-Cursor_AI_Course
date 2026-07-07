import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { TaskProvider } from '@/context/TaskContext'
import { GuestRoute, ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AnalyticsDashboardPage } from '@/pages/AnalyticsDashboardPage'
import { ProductSearchPage } from '@/pages/ProductSearchPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { TaskDashboardPage } from '@/pages/TaskDashboardPage'
import { KanbanPage } from '@/pages/KanbanPage'
import { UserProfileDemoPage } from '@/pages/UserProfileDemoPage'

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Public routes */}
            <Route path="/products" element={<ProductSearchPage />} />
            <Route path="/demos/profile" element={<UserProfileDemoPage />} />
            <Route path="/demos/settings" element={<SettingsPage />} />
            <Route path="/demos/analytics" element={<AnalyticsDashboardPage />} />
            <Route path="/demos/products" element={<ProductSearchPage />} />

            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <RegisterPage />
                </GuestRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/board"
              element={
                <ProtectedRoute>
                  <KanbanPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <TaskDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  )
}

export default App
