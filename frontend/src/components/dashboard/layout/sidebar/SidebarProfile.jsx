import { useEffect, useRef, useState } from 'react'
import SidebarTooltip from './SidebarTooltip.jsx'

function ProfileIcon({ name }) {
  const paths = {
    person: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.8Z" /></>,
    upgrade: <><path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" /><path d="m19 15 .7 1.8L22 18l-2.3.8L19 21l-.8-2.2L16 18l2.2-.9L19 15Z" /></>,
    logout: <><path d="M10 17l5-5-5-5m5 5H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
  }

  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

export default function SidebarProfile({ name, role, collapsed, onProfileAction }) {
  const [open, setOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    function handlePointerDown(event) {
      if (!profileRef.current?.contains(event.target)) setOpen(false)
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  function selectAction(action) {
    setOpen(false)
    onProfileAction(action)
  }

  return (
    <div className="sidebar-profile-wrap" ref={profileRef}>
      <SidebarTooltip label={`${name} · Free Plan`} disabled={!collapsed || open}>
        <button
          className={`sidebar-profile-trigger${open ? ' is-open' : ''}`}
          type="button"
          aria-label={`${name}, Free Plan`}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((current) => !current)}
        >
          <span className="dash-avatar sidebar-avatar" aria-hidden="true">{name.trim().charAt(0).toUpperCase() || 'A'}</span>
          <span className="sidebar-profile-copy">
            <strong>{name}</strong>
            <small>{role}</small>
            <span className="sidebar-plan"><i />Free Plan</span>
          </span>
          {!collapsed && <span className="sidebar-profile-more" aria-hidden="true">···</span>}
        </button>
      </SidebarTooltip>
      {open && (
        <div className={`sidebar-profile-menu${collapsed ? ' is-collapsed' : ''}`} role="menu" aria-label="Profile menu">
          <div className="sidebar-menu-identity">
            <strong>{name}</strong>
            <span>Free Plan</span>
          </div>
          <button type="button" role="menuitem" onClick={() => selectAction('profile')}><ProfileIcon name="person" />Profile</button>
          <button type="button" role="menuitem" onClick={() => selectAction('settings')}><ProfileIcon name="settings" />Account Settings</button>
          <button type="button" role="menuitem" onClick={() => selectAction('upgrade')}><ProfileIcon name="upgrade" />Upgrade Plan</button>
          <span className="sidebar-menu-divider" />
          <button type="button" role="menuitem" className="is-logout" onClick={() => selectAction('logout')}><ProfileIcon name="logout" />Log out</button>
        </div>
      )}
    </div>
  )
}
