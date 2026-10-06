import DashboardFeaturesSection from './DashboardFeaturesSection.jsx'
import PerformanceSection from './performance/PerformanceSection.jsx'
import RecentInterviewsSection from './interviews/RecentInterviewsSection.jsx'
import ResumeInterviewSection from './resume/ResumeInterviewSection.jsx'
import StatsSection from './stats/StatsSection.jsx'

export default function DashboardContent({ dashboardData, search, onStartInterview, onOpenReport }) {
  const { interviewConfiguration, copy, statistics, performance, recentInterviews, features } = dashboardData

  return (
    <>
      <ResumeInterviewSection
        interviewConfiguration={interviewConfiguration}
        copy={copy}
        onStartInterview={onStartInterview}
      />
      <StatsSection statistics={statistics} />
      <section className="dash-compact-analysis">
        <PerformanceSection performance={performance} />
        <RecentInterviewsSection
          interviews={recentInterviews}
          search={search}
          copy={copy}
          onOpenReport={onOpenReport}
        />
      </section>
      <DashboardFeaturesSection features={features} />
      <p className="dash-demo-note">{copy.demoNotice}</p>
    </>
  )
}
