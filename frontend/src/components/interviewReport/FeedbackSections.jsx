import ReportIcon from './ReportIcon.jsx'

export function StrengthsSection({ items }) {
  return (
    <section className="report-panel report-feedback-panel is-strength">
      <div className="report-section-heading">
        <span className="report-heading-icon is-green"><ReportIcon name="check" size={19} /></span>
        <div><h2>What You Did Well</h2></div>
      </div>
      <ul className="report-feedback-list">
        {items.map((item) => <li key={item}><span><ReportIcon name="check" size={12} /></span>{item}</li>)}
      </ul>
      <div className="report-feedback-art report-trophy-art" aria-hidden="true">🏆</div>
    </section>
  )
}

export function ImprovementSection({ items }) {
  return (
    <section className="report-panel report-feedback-panel is-improvement">
      <div className="report-section-heading">
        <span className="report-heading-icon is-orange"><ReportIcon name="chart" size={19} /></span>
        <div><h2>Areas to Improve</h2></div>
      </div>
      <ul className="report-feedback-list">
        {items.map((item) => <li key={item}><span className="report-improve-marker">↗</span>{item}</li>)}
      </ul>
      <div className="report-feedback-art report-target-art" aria-hidden="true">◎</div>
    </section>
  )
}
