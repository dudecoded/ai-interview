export default function SidebarSection({ title, collapsed = false, children }) {
  return (
    <section className={`sidebar-section${collapsed ? ' is-collapsed' : ''}`} aria-label={title}>
      {!collapsed && <h2 className="sidebar-section-title">{title}</h2>}
      <div className="sidebar-section-items">{children}</div>
    </section>
  )
}
