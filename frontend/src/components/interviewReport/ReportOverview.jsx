import ReportIcon from './ReportIcon.jsx'

export default function ReportOverview({ candidate, interview }) {
  return (
    <section className="report-overview">
      <div className="report-overview-title">
        <h1>Interview Complete <span aria-hidden="true">🎉</span></h1>
        <p>Here's how you performed in your AI interview.</p>
      </div>
      <div className="report-overview-meta">
        <div><ReportIcon name="file" size={17} /><span><small>Interview based on</small><strong>{candidate.resume}</strong></span></div>
        <i />
        <div><ReportIcon name="code" size={18} /><span><small>Target Role</small><strong>{candidate.role}</strong></span></div>
      </div>
      <div className="report-overview-tags">
        <span><ReportIcon name="calendar" size={14} />{interview.date}</span>
        <span><ReportIcon name="clock" size={14} />{interview.duration}</span>
        <span><ReportIcon name="chart" size={14} />{interview.difficulty} Difficulty</span>
      </div>
    </section>
  )
}
