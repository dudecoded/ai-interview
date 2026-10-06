import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../auth/useAuth.js'
import DashboardContent from './DashboardContent.jsx'
import DashboardDialog from './DashboardDialog.jsx'
import DashboardLayout from './layout/DashboardLayout.jsx'
import '../../pages/Dashboard.css'

export default function DashboardView({ dashboardData }) {
  const navigate = useNavigate()
  const { user, logout: clearAuth } = useAuth()
  const { profile, notifications, copy } = dashboardData
  const name = user?.name || profile.name
  const [search, setSearch] = useState('')
  const [activeSection, setActiveSection] = useState('dashboard')
  const [dialog, setDialog] = useState(null)

  function navigateSection(section) {
    const sectionMessages = {
      skills: { title: 'Interview Skills', message: 'Interview skills coaching will be available here as the practice library is connected.' },
      settings: { title: 'Account Settings', message: copy.settingsUnavailable },
      help: { title: 'Help & Support', message: 'Help and support will be available here when support services are connected.' },
    }
    if (sectionMessages[section]) {
      setDialog(sectionMessages[section])
      setActiveSection(section)
      return
    }
    setActiveSection(section)
    const targetId = section === 'history' || section === 'reports' ? 'recent' : section
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleProfileAction(action) {
    if (action === 'logout') {
      clearAuth()
      navigate('/login', { replace: true })
      return
    }
    const profileMessages = {
      profile: { title: 'Profile', message: `${name} · ${profile.targetRole || 'Interview candidate'}` },
      settings: { title: 'Account Settings', message: copy.settingsUnavailable },
      upgrade: { title: 'Upgrade Plan', message: 'Plan upgrades will be available when billing is connected.' },
    }
    setDialog(profileMessages[action])
  }

  function startResumeInterview(configuration) {
    navigate('/interview', {
      state: { interviewConfiguration: configuration },
    })
  }

  function openReport(interview) {
    setDialog({
      title: 'Interview report preview',
      message: `Demo report for ${interview.role} on ${interview.date}: score ${interview.score}. ${copy.reportUnavailable}`,
    })
  }

  return (
    <>
      <DashboardLayout
        name={name}
        role={profile.targetRole || 'Interview candidate'}
        activeItem={activeSection}
        onNavigate={navigateSection}
        onProfileAction={handleProfileAction}
        search={search}
        onSearchChange={setSearch}
        notifications={notifications}
      >
        <DashboardContent
          dashboardData={dashboardData}
          search={search}
          onStartInterview={startResumeInterview}
          onOpenReport={openReport}
        />
        <DashboardDialog dialog={dialog} onClose={() => setDialog(null)} />
      </DashboardLayout>
    </>
  )
}
