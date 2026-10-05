import ReportIcon from './ReportIcon.jsx'

export default function CommunicationAnalysis({ metrics }) {
  return (
    <section className="report-panel report-communication">
      <div className="report-section-heading">
        <span className="report-heading-icon is-violet"><ReportIcon name="chart" size={18} /></span>
        <div><h2>Communication Analysis</h2></div>
      </div>
      <ul className="report-communication-list">
        {metrics.map((metric) => (
          <li key={metric.id} style={{ '--communication-color': metric.color }}>
            <ReportIcon name={metric.id === 'speakingPace' || metric.id === 'fillerWords' ? 'chart' : 'spark'} size={15} />
            <span>{metric.name}</span>
            {metric.value
              ? <div className="report-communication-meter"><i style={{ width: `${metric.value}%` }} /></div>
              : <div className="report-communication-meter is-qualitative"><i style={{ width: metric.id === 'fillerWords' ? '58%' : '72%' }} /></div>}
            <strong>{metric.display}</strong>
          </li>
        ))}
      </ul>
    </section>
  )
}
