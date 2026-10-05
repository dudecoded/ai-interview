import ReportIcon from './ReportIcon.jsx'

const META_ICONS = {
  resume: 'file',
  role: 'code',
  experience: 'chart',
  difficulty: 'spark',
  duration: 'clock',
  questions: 'file',
  answered: 'check',
  date: 'calendar',
}

export default function InterviewSummary({ candidate, interview }) {
  const rows = [
    ['resume', 'Resume', candidate.resume],
    ['role', 'Target Role', candidate.role],
    ['experience', 'Experience Level', candidate.experienceLevel],
    ['difficulty', 'Difficulty', interview.difficulty],
    ['duration', 'Duration', interview.duration],
    ['questions', 'Total Questions', interview.totalQuestions],
    ['answered', 'Answered', `${interview.answeredQuestions} / ${interview.totalQuestions}`],
    ['date', 'Date', interview.date],
  ]

  return (
    <section className="report-panel report-summary">
      <div className="report-section-heading">
        <span className="report-heading-icon is-blue"><ReportIcon name="file" size={18} /></span>
        <div><h2>Interview Summary</h2></div>
      </div>
      <dl className="report-summary-list">
        {rows.map(([id, label, value]) => (
          <div key={id}>
            <dt><ReportIcon name={META_ICONS[id]} size={14} />{label}</dt>
            <dd title={String(value)}>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
