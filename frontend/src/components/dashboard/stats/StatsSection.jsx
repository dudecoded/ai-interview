import DashboardIcon from '../DashboardIcon.jsx'

function StatCard({ icon, value, label, trend }) {
  return (
    <article className="dash-card dash-stat-card">
      <span className="dash-stat-icon"><DashboardIcon name={icon} size={22} /></span>
      <div className="dash-stat-value"><strong>{value}</strong><span>{label}</span></div>
      {trend && <small>{trend}</small>}
    </article>
  )
}

export default function StatsSection({ statistics }) {
  return (
    <section className="dash-stat-grid" aria-label="Quick statistics">
      {statistics.map((statistic) => <StatCard key={statistic.id} {...statistic} />)}
    </section>
  )
}
