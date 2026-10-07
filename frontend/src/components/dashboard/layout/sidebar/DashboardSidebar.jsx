import { useEffect, useState } from 'react'
import SidebarNavItem, { SidebarIcon } from './SidebarNavItem.jsx'
import SidebarProfile from './SidebarProfile.jsx'
import SidebarSection from './SidebarSection.jsx'

const sections = [
  { title: 'HOME', items: [{ label: 'Dashboard', key: 'dashboard', icon: 'dashboard' }] },
  { title: 'PRACTICE', items: [
    { label: 'New Interview', key: 'practice', icon: 'interview', prominent: true },
    { label: 'Interview History', key: 'history', icon: 'history' },
  ] },
  { title: 'PREPARE', items: [
    { label: 'My Resume', key: 'resume', icon: 'resume' },
    { label: 'Interview Skills', key: 'skills', icon: 'skills' },
  ] },
  { title: 'INSIGHTS', items: [
    { label: 'Performance', key: 'performance', icon: 'performance' },
    { label: 'Reports', key: 'reports', icon: 'reports' },
  ] },
]

export default function DashboardSidebar({ name, role, activeItem, collapsed, mobileOpen, onNavigate, onProfileAction, onToggleCollapse }) {
  const [tabletCompact, setTabletCompact] = useState(() => window.matchMedia('(max-width: 1020px) and (min-width: 761px)').matches)
  const isCompact = (collapsed || tabletCompact) && !mobileOpen

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1020px) and (min-width: 761px)')
    const updateTabletCompact = (event) => setTabletCompact(event.matches)
    mediaQuery.addEventListener('change', updateTabletCompact)
    return () => mediaQuery.removeEventListener('change', updateTabletCompact)
  }, [])

  return (
    <aside className={`dash-sidebar${mobileOpen ? ' dash-sidebar-open' : ''}${isCompact ? ' is-collapsed' : ''}`} aria-label="Dashboard sidebar">
      <div className="sidebar-brand-row">
        <a className="sidebar-brand" href="#dashboard" onClick={(event) => { event.preventDefault(); onNavigate('dashboard') }}>
          <span className="sidebar-brand-mark"><SidebarIcon name="interview" size={18} /></span>
          <span className="sidebar-brand-copy"><strong>Interview<span>AI</span></strong><small>AI Interview Coach</small></span>
        </a>
        <button className="sidebar-collapse-button" type="button" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!isCompact} aria-controls="sidebar-navigation" title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={onToggleCollapse}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {collapsed ? <><path d="M9 5h10v14H9z" /><path d="M5 5v14" /></> : <><path d="M5 5h10v14H5z" /><path d="M19 5v14" /></>}
          </svg>
        </button>
      </div>
      <nav className="sidebar-navigation" id="sidebar-navigation" aria-label="Main navigation">
        {sections.map(({ title, items }) => (
          <SidebarSection key={title} title={title} collapsed={isCompact}>
            {items.map(({ label, key, icon, prominent }) => (
              <SidebarNavItem
                key={key}
                label={label}
                icon={icon}
                active={activeItem === key}
                prominent={prominent}
                collapsed={isCompact}
                onClick={() => onNavigate(key)}
              />
            ))}
          </SidebarSection>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-footer-links">
          <SidebarNavItem label="Settings" icon="settings" collapsed={isCompact} active={activeItem === 'settings'} onClick={() => onNavigate('settings')} />
          <SidebarNavItem label="Help & Support" icon="help" collapsed={isCompact} active={activeItem === 'help'} onClick={() => onNavigate('help')} />
        </div>
        <SidebarProfile name={name} role={role} collapsed={isCompact} onProfileAction={onProfileAction} />
      </div>
    </aside>
  )
}
