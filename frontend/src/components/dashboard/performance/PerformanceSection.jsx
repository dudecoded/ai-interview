function SectionTitle({ children }) {
  return <div className="dash-section-title"><h2>{children}</h2></div>
}

function PerformanceChart({ chart }) {
  return (
    <div className="dash-chart-card">
      <span>{chart.title}</span>
      <svg className="dash-line-chart" viewBox="0 0 470 125" role="img" aria-label={chart.accessibleDescription}>
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#743cff" stopOpacity=".38" /><stop offset="100%" stopColor="#743cff" stopOpacity=".02" /></linearGradient>
          <linearGradient id="chartLine"><stop stopColor="#438dff" /><stop offset="100%" stopColor="#a144ff" /></linearGradient>
        </defs>
        {chart.gridLines.map((y) => <line key={y} x1="35" y1={y} x2="462" y2={y} className="dash-chart-gridline" />)}
        {chart.yAxisLabels.map((score, index) => <text key={score} x="5" y={98 - index * 20} className="dash-chart-y-label">{score}</text>)}
        <path d={chart.fillPath} fill="url(#chartFill)" />
        <path d={chart.linePath} fill="none" stroke="url(#chartLine)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {chart.points.map(({ x, y, date }) => <circle key={date} cx={x} cy={y} r="3.5" className="dash-chart-point" />)}
        {chart.points.map(({ x, date }) => <text key={date} x={x} y="119" textAnchor="middle" className="dash-chart-x-label">{date}</text>)}
      </svg>
    </div>
  )
}

function PerformanceBreakdown({ breakdown }) {
  return (
    <div className="dash-score-grid">
      {breakdown.map(({ label, value, trend, percent }) => (
        <article className="dash-score-card" key={label}>
          <span>{label}</span><div><strong>{value}</strong><small>{trend}</small></div><i><b style={{ width: `${percent}%` }} /></i>
        </article>
      ))}
    </div>
  )
}

export default function PerformanceSection({ performance }) {
  return (
    <section className="dash-performance" id="performance">
      <SectionTitle>Performance Overview</SectionTitle>
      <div className="dash-performance-content">
        <PerformanceChart chart={performance.chart} />
        <PerformanceBreakdown breakdown={performance.breakdown} />
      </div>
    </section>
  )
}
