export default function SidebarTooltip({ children, label, disabled = false }) {
  return (
    <span className={`sidebar-tooltip-wrap${disabled ? '' : ' has-sidebar-tooltip'}`}>
      {children}
      {!disabled && <span className="sidebar-tooltip" role="tooltip">{label}</span>}
    </span>
  )
}
