import SidebarTooltip from './SidebarTooltip.jsx'

const iconPaths = {
  dashboard: <><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="11" width="7" height="10" rx="1.5" /><rect x="3" y="14" width="8" height="7" rx="1.5" /></>,
  interview: <><rect x="9" y="2" width="6" height="13" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v4m-4 0h8" /><path d="m19 3 .7 2.1L22 6l-2.3.8L19 9l-.8-2.2L16 6l2.2-.9L19 3Z" /></>,
  history: <><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" /><path d="M3 3v5h5m4-1v5l3 2" /></>,
  resume: <><path d="M6 2h8l5 5v15H6z" /><path d="M14 2v6h5m-9 4h6m-6 4h6m-6 4h4" /></>,
  skills: <><path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z" /><path d="m9 12 2 2 4-4" /></>,
  performance: <><path d="M3 3v18h18" /><path d="m7 14 4-4 4 3 6-7" /><path d="M16 6h5v5" /></>,
  reports: <><path d="M6 2h8l5 5v15H6z" /><path d="M14 2v6h5m-9 4h6m-6 4h6m-6 4h3" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.8Z" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.6 9a2.5 2.5 0 1 1 4.4 1.6c-.9.9-2 1.3-2 2.9m0 3h.01" /></>,
}

export function SidebarIcon({ name, size = 18 }) {
  return (
    <svg className="dash-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  )
}

export default function SidebarNavItem({ label, icon, active = false, prominent = false, collapsed = false, onClick }) {
  return (
    <SidebarTooltip label={label} disabled={!collapsed}>
      <button
        className={`sidebar-nav-item${active ? ' is-active' : ''}${prominent ? ' is-primary' : ''}`}
        type="button"
        aria-current={active ? 'page' : undefined}
        aria-label={collapsed ? label : undefined}
        onClick={onClick}
      >
        <SidebarIcon name={icon} />
        <span className="sidebar-nav-label">{label}</span>
      </button>
    </SidebarTooltip>
  )
}
