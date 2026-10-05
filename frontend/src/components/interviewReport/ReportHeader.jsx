import ReportIcon from './ReportIcon.jsx'

export default function ReportHeader({ onDownload, onDashboard }) {
  return (
    <header className="report-header">
      <a className="report-brand" href="/dashboard" onClick={(event) => { event.preventDefault(); onDashboard() }}>
        <span className="report-brand-mark" />
        <strong>InterviewAI</strong>
        <i />
        <span>Interview Report</span>
      </a>
      <div className="report-header-actions">
        <button className="report-button report-button-outline" type="button" title="Open the browser print dialog to print or save as PDF" onClick={onDownload}>
          <ReportIcon name="download" />Download Report
        </button>
        <button className="report-button report-button-primary" type="button" onClick={onDashboard}>
          Back to Dashboard <ReportIcon name="arrow" />
        </button>
      </div>
    </header>
  )
}
