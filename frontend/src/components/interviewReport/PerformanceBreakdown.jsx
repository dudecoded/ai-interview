import ReportIcon from './ReportIcon.jsx'

function RadarChart({ metrics }) {
  const center = 100
  const radius = 67
  const makePoints = (key) => metrics.map((metric, index) => {
    const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2
    const distance = radius * metric[key] / 100
    return `${center + Math.cos(angle) * distance},${center + Math.sin(angle) * distance}`
  }).join(' ')
  const points = makePoints('score')
  const averagePoints = makePoints('average')
  const axes = metrics.map((metric, index) => {
    const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2
    return {
      name: metric.name,
      x: center + Math.cos(angle) * (radius + 20),
      y: center + Math.sin(angle) * (radius + 20),
      x2: center + Math.cos(angle) * radius,
      y2: center + Math.sin(angle) * radius,
    }
  })

  return (
    <svg className="report-radar" viewBox="0 0 200 200" role="img" aria-label={`Performance radar chart for ${metrics.map(({ name, score }) => `${name} ${score}`).join(', ')}`}>
      {[.25, .5, .75, 1].map((scale) => (
        <polygon
          key={scale}
          points={metrics.map((_, index) => {
            const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2
            return `${center + Math.cos(angle) * radius * scale},${center + Math.sin(angle) * radius * scale}`
          }).join(' ')}
          className="report-radar-grid"
        />
      ))}
      {axes.map((axis) => <line key={axis.name} x1={center} y1={center} x2={axis.x2} y2={axis.y2} className="report-radar-axis" />)}
      <polygon points={averagePoints} className="report-radar-average" />
      <polygon points={points} className="report-radar-area" />
      {metrics.map((metric, index) => {
        const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2
        const x = center + Math.cos(angle) * radius * metric.score / 100
        const y = center + Math.sin(angle) * radius * metric.score / 100
        return <circle key={metric.id} cx={x} cy={y} r="3" className="report-radar-point" />
      })}
      {axes.map((axis) => (
        <text key={`${axis.name}-label`} x={axis.x} y={axis.y} className="report-radar-label" textAnchor="middle" dominantBaseline="middle">
          {axis.name.split(' ').map((word, index) => <tspan key={word} x={axis.x} dy={index === 0 ? 0 : 10}>{word}</tspan>)}
        </text>
      ))}
    </svg>
  )
}

function SkillScore({ metric }) {
  return (
    <div className="report-skill-score" style={{ '--metric-color': metric.color, '--metric-score': `${metric.score}%` }}>
      <div className="report-skill-ring"><span>{metric.score}%</span></div>
      <strong>{metric.name}</strong>
    </div>
  )
}

export default function PerformanceBreakdown({ metrics }) {
  return (
    <section className="report-panel report-breakdown">
      <div className="report-section-heading">
        <span className="report-heading-icon is-blue"><ReportIcon name="chart" size={19} /></span>
        <div><h2>Performance Breakdown</h2><p>Analysis of your performance across key areas</p></div>
        <div className="report-chart-legend"><span><i />Your Score</span><span><i />Average Score</span></div>
      </div>
      <div className="report-breakdown-content">
        <div className="report-skill-grid">{metrics.map((metric) => <SkillScore metric={metric} key={metric.id} />)}</div>
        <RadarChart metrics={metrics} />
      </div>
    </section>
  )
}
