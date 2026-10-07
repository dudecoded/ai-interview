import DashboardIcon from './DashboardIcon.jsx'

function SectionTitle({ children }) {
  return <div className="dash-section-title"><h2>{children}</h2></div>
}

function FeatureCard({ icon, title, description }) {
  return (
    <article className="dash-card dash-feature-card" key={title}>
      <span className="dash-feature-icon"><DashboardIcon name={icon} size={17} /></span>
      <div><h3>{title}</h3><p>{description}</p></div>
    </article>
  )
}

export default function DashboardFeaturesSection({ features }) {
  return (
    <section className="dash-features-section">
      <SectionTitle>AI Interview Features</SectionTitle>
      <div className="dash-feature-grid">
        {features.map(([icon, title, description]) => <FeatureCard key={title} icon={icon} title={title} description={description} />)}
      </div>
    </section>
  )
}
