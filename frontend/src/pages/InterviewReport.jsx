import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import AISummary from '../components/interviewReport/AISummary.jsx'
import AIRecommendations from '../components/interviewReport/AIRecommendations.jsx'
import CommunicationAnalysis from '../components/interviewReport/CommunicationAnalysis.jsx'
import {
  ImprovementSection,
  StrengthsSection,
} from '../components/interviewReport/FeedbackSections.jsx'
import InterviewSummary from '../components/interviewReport/InterviewSummary.jsx'
import OverallScore from '../components/interviewReport/OverallScore.jsx'
import PerformanceBreakdown from '../components/interviewReport/PerformanceBreakdown.jsx'
import QuestionAnalysis from '../components/interviewReport/QuestionAnalysis.jsx'
import ReportHeader from '../components/interviewReport/ReportHeader.jsx'
import ReportOverview from '../components/interviewReport/ReportOverview.jsx'

import { getInterviewReport } from '../services/interviewReportService.js'

import './InterviewReport.css'

export default function InterviewReport() {
  const location = useLocation()
  const navigate = useNavigate()

  const session = location.state?.session

  const [report, setReport] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session) return undefined

    let active = true

    getInterviewReport(session)
      .then((data) => {
        if (active) {
          setReport(data)
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(
            loadError.message ||
            'The interview report could not be loaded.',
          )
        }
      })

    return () => {
      active = false
    }
  }, [session])

  if (!session) {
    return <Navigate to="/dashboard" replace />
  }

  if (error) {
    return (
      <main className="report-load-state" role="alert">
        <h1>Report could not be loaded</h1>

        <p>{error}</p>

        <button
          type="button"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </main>
    )
  }

  if (!report) {
    return (
      <main
        className="report-load-state"
        role="status"
      >
        Preparing your performance report...
      </main>
    )
  }

  return (
    <main className="performance-report">
      <ReportHeader
        onDashboard={() => navigate('/dashboard')}
        onDownload={() => window.print()}
      />

      <div className="report-page-content">

        <section className="report-identity-panel">
          <ReportOverview
            candidate={report.candidate}
            interview={report.interview}
          />

          <OverallScore
            score={report.overallScore}
            interpretation={report.scoreInterpretation}
            improvement={report.improvementFromPrevious}
            averageScore={report.averageScore}
          />
        </section>

        <PerformanceBreakdown
          metrics={report.performance}
        />

        <AISummary>
          {report.aiSummary}
        </AISummary>

        <StrengthsSection
          items={report.strengths}
        />

        <ImprovementSection
          items={report.improvements}
        />

        <CommunicationAnalysis
          metrics={report.communication}
        />

        <QuestionAnalysis
          questions={report.questions}
          initialQuestion={session.currentQuestion}
        />

        <AIRecommendations
          recommendations={report.recommendations}
          nextPractice={report.nextPractice}
          onPractice={() => navigate('/dashboard')}
        />

        <InterviewSummary
          candidate={report.candidate}
          interview={report.interview}
        />

        <p className="report-demo-note">
          {report.reportNote}
        </p>

      </div>
    </main>
  )
}