import { useState } from 'react'
import DashboardNavbar from '../navbar/DashboardNavbar.jsx'
import DashboardSidebar from './sidebar/DashboardSidebar.jsx'

export default function DashboardLayout({ name, role, activeItem, onNavigate, onProfileAction, search, onSearchChange, notifications, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  function navigateFromSidebar(item) {
    onNavigate(item)
    setMobileSidebarOpen(false)
  }

  return (
    <div className={`dashboard-shell${sidebarCollapsed ? ' is-sidebar-collapsed' : ''}`}>
      {mobileSidebarOpen && <button className="dash-mobile-scrim" type="button" aria-label="Close navigation" onClick={() => setMobileSidebarOpen(false)} />}
      <DashboardSidebar
        name={name}
        role={role}
        activeItem={activeItem}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onNavigate={navigateFromSidebar}
        onProfileAction={onProfileAction}
        onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
      />
      <main className="dash-main" id="dashboard">
        <DashboardNavbar
          name={name}
          search={search}
          onSearchChange={onSearchChange}
          notifications={notifications}
          onOpenNavigation={() => setMobileSidebarOpen(true)}
        />
        {children}
      </main>
    </div>
  )
}
