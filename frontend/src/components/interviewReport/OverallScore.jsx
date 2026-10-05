export default function OverallScore({ score, interpretation, improvement, averageScore }) {
  return (
    <section className="report-overall-score" aria-label={`Overall score ${score} out of 100`}>
      <div className="report-score-ring" style={{ '--score': `${score}%` }}>
        <div className="report-score-ring-inner">
          <strong>{score}</strong>
          <span>/ 100</span>
          <small>Overall Score</small>
        </div>
      </div>
      <strong className="report-score-interpretation">{interpretation}</strong>
      <span className="report-improvement">↑ {improvement}% improvement</span>
      <small className="report-score-caption">from your previous interview · peer average {averageScore}</small>
    </section>
  )
}
