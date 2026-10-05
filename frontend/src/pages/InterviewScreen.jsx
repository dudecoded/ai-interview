import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import mockDashboardData from '../data/mockDashboardData.js'
import './Dashboard.css'

export default function InterviewScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const configuration = location.state?.interviewConfiguration

  if (!configuration?.selectedResume?.fileName) return <Navigate to="/dashboard" replace />

  const { fields } = mockDashboardData.interviewConfiguration
  const settings = [
    [fields.targetRole.label, configuration.targetRole],
    [fields.experienceLevel.label, configuration.experienceLevel],
    [fields.duration.label, configuration.duration],
    [fields.difficulty.label, configuration.difficulty],
  ]

  return (
    <main className="dash-interview-screen">
      <section className="dash-interview-screen-card" aria-labelledby="interview-screen-title">
        <span className="dash-brand-mark" aria-hidden="true">AI</span>
        <h1 id="interview-screen-title">Interview configuration received</h1>
        <p className="dash-interview-screen-description">{mockDashboardData.copy.interviewUnavailable}</p>
        <div className="dash-interview-screen-resume">
          <span>Resume</span>
          <strong>{configuration.selectedResume.fileName}</strong>
        </div>
        <dl className="dash-interview-screen-settings">
          {settings.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <button className="dash-primary-button" type="button" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </section>
    </main>
  )
}
