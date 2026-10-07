import ReportIcon from './ReportIcon.jsx'

export default function AIRecommendations({ recommendations, nextPractice, onPractice }) {
  return (
    <section className="report-panel report-ai-coach">
      <div className="report-section-heading">
        <span className="report-heading-icon is-violet"><ReportIcon name="spark" size={19} /></span>
        <div><h2>Your AI Coach</h2><p>Your personalized improvement plan</p></div>
      </div>
      <div className="report-coach-content">
        <ol className="report-recommendations">
          {recommendations.map((recommendation, index) => <li key={recommendation}><i>{index + 1}</i><span>{recommendation}</span></li>)}
        </ol>
        <aside className="report-next-practice">
          <span className="report-next-practice-icon"><ReportIcon name="code" size={20} /></span>
          <small>Recommended Next Practice</small>
          <strong>{nextPractice.title}</strong>
          <span className="report-next-practice-meta">{nextPractice.difficulty} · {nextPractice.duration}</span>
          <button type="button" onClick={onPractice}>Practice Again <ReportIcon name="arrow" size={15} /></button>
        </aside>
      </div>
    </section>
  )
}
