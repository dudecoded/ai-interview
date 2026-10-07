import { useState } from 'react'
import DashboardIcon from '../DashboardIcon.jsx'

export default function DashboardNavbar({ name, search, onSearchChange, notifications, onOpenNavigation }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <header className="dash-topbar">
      <button className="dash-menu-toggle" type="button" aria-label="Open navigation" onClick={onOpenNavigation}><DashboardIcon name="menu" /></button>
      <div className="dash-greeting">
        <h1>Welcome back, {name}</h1>
        <p>Your journey to interview success starts here.</p>
      </div>
      <div className="dash-topbar-actions">
        <label className="dash-search">
          <DashboardIcon name="search" size={17} />
          <input aria-label="Search interviews" placeholder="Search interviews..." value={search} onChange={(event) => onSearchChange(event.target.value)} />
        </label>
        <div className="dash-popover-wrap">
          <button className={`dash-round-button${notificationsOpen ? ' is-open' : ''}`} type="button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)}><DashboardIcon name="bell" size={18} /></button>
          {notificationsOpen && <div className="dash-popover dash-notification-popover"><strong>{notifications.title}</strong><p>{notifications.message}</p></div>}
        </div>
      </div>
    </header>
  )
}
