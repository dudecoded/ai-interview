import { useCallback, useEffect, useState } from 'react'
import DashboardView from '../components/dashboard/DashboardView.jsx'
import { getDashboardData } from '../services/dashboardService.js'

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [error, setError] = useState(null)
  const [requestId, setRequestId] = useState(0)

  const reloadDashboard = useCallback(() => {
    setError(null)
    setDashboardData(null)
    setRequestId((current) => current + 1)
  }, [])

  useEffect(() => {
    let active = true

    getDashboardData()
      .then((data) => {
        if (active) setDashboardData(data)
      })
      .catch((loadError) => {
        if (active) setError(loadError)
      })

    return () => {
      active = false
    }
  }, [requestId])

  if (error) {
    return (
      <main className="dashboard-load-state" role="alert">
        <h1>Dashboard data couldn’t be loaded</h1>
        <p>{error.message || 'Please try again.'}</p>
        <button type="button" onClick={reloadDashboard}>Retry</button>
      </main>
    )
  }

  if (!dashboardData) {
    return (
      <main className="dashboard-load-state" role="status">
        <p>Loading dashboard…</p>
      </main>
    )
  }

  return <DashboardView dashboardData={dashboardData} />
}
