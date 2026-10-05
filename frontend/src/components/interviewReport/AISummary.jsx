import ReportIcon from './ReportIcon.jsx'

export default function AISummary({ children }) {
  return (
    <section className="report-panel report-ai-summary">
      <div className="report-section-heading">
        <span className="report-heading-icon is-violet"><ReportIcon name="spark" size={18} /></span>
        <div><h2>AI Summary</h2></div>
      </div>
      <p>{children}</p>
      <div className="report-summary-orb" aria-hidden="true"><span /><i /><i /><i /></div>
    </section>
  )
}
