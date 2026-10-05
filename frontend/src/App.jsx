import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import InterviewScreen from './pages/InterviewScreen.jsx'
import useAuth from './auth/useAuth.js'

const DASHBOARD_PREVIEW_ENABLED = import.meta.env.DEV

function DashboardRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated || DASHBOARD_PREVIEW_ENABLED
    ? <Dashboard />
    : <Navigate to="/login" replace />
}

function InterviewRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated || DASHBOARD_PREVIEW_ENABLED
    ? <InterviewScreen />
    : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<DashboardRoute />} />
      <Route path="/interview" element={<InterviewRoute />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
