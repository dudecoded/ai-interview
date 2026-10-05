import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../auth/useAuth.js'
import '../../pages/Dashboard.css'

function Icon({ name, size = 20 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    mic: <><rect x="9" y="2" width="6" height="13" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v4m-4 0h8" /></>,
    list: <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></>,
    file: <><path d="M6 2h8l5 5v15H6z" /><path d="M14 2v6h5m-9 5h5m-5 4h5" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m7 14 4-4 4 3 6-7" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.8Z" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    trend: <><path d="m3 17 6-6 4 4 8-9" /><path d="M15 6h6v6" /></>,
    spark: <><path d="m12 2 1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2Z" /><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 13h4" /></>,
    upload: <><path d="M12 16V4m-5 5 5-5 5 5" /><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" /></>,
    logout: <><path d="M10 17l5-5-5-5m5 5H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  }

  return (
    <svg className="dash-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || paths.spark}
    </svg>
  )
}

function Avatar({ name, small = false }) {
  const initial = name.trim().charAt(0).toUpperCase() || 'A'
  return <span className={`dash-avatar${small ? ' dash-avatar-small' : ''}`} aria-label={`${name} avatar`}>{initial}</span>
}

function SectionTitle({ children }) {
  return <div className="dash-section-title"><h2>{children}</h2></div>
}

function DashboardView({ dashboardData }) {
  const navigate = useNavigate()
  const { user, logout: clearAuth } = useAuth()
  const { profile, statistics, interviewConfiguration, performance, recentInterviews, notifications, features, navigation, copy } = dashboardData
  const name = user?.name || profile.name
  const [configuration, setConfiguration] = useState(() => ({
    selectedResume: interviewConfiguration.selectedResume,
    targetRole: interviewConfiguration.targetRole,
    experienceLevel: interviewConfiguration.experienceLevel,
    duration: interviewConfiguration.duration,
    difficulty: interviewConfiguration.difficulty,
  }))
  const [resumeMessage, setResumeMessage] = useState(interviewConfiguration.selectedResume?.status || '')
  const [configurationError, setConfigurationError] = useState('')
  const [search, setSearch] = useState('')
  const [activeSection, setActiveSection] = useState('dashboard')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [dialog, setDialog] = useState(null)
  const fileInput = useRef(null)

  const filteredInterviews = useMemo(
    () => recentInterviews
      .filter((interview) => `${interview.role} ${interview.date} ${interview.score} ${interview.status}`.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 3),
    [recentInterviews, search],
  )

  function navigateSection(section) {
    if (section === 'settings') {
      setDialog({ title: 'Settings', message: copy.settingsUnavailable })
      setActiveSection(section)
      setMobileSidebarOpen(false)
      return
    }
    setActiveSection(section)
    setMobileSidebarOpen(false)
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleResumeSelection(event) {
    const file = event.currentTarget.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setResumeMessage(copy.invalidResumeType)
      event.currentTarget.value = ''
      return
    }
    setConfiguration((current) => ({ ...current, selectedResume: { fileName: file.name, status: copy.localResumeSelection, file } }))
    setResumeMessage(copy.localResumeSelection)
    setConfigurationError('')
    event.currentTarget.value = ''
  }

  function removeResume() {
    setConfiguration((current) => ({ ...current, selectedResume: null }))
    setResumeMessage('')
    setConfigurationError('')
  }

  function updateInterviewConfiguration(field, value) {
    setConfiguration((current) => ({ ...current, [field]: value }))
    setConfigurationError('')
  }

  function startResumeInterview(event) {
    event.preventDefault()
    if (!configuration.selectedResume || !configuration.targetRole || !configuration.experienceLevel || !configuration.duration || !configuration.difficulty) {
      setConfigurationError('Upload a resume and complete every interview field before continuing.')
      return
    }
    navigate('/interview', {
      state: { interviewConfiguration: configuration },
    })
  }

  function logout() {
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
    <div className="dashboard-shell">
      {mobileSidebarOpen && <button className="dash-mobile-scrim" type="button" aria-label="Close navigation" onClick={() => setMobileSidebarOpen(false)} />}
      <aside className={`dash-sidebar${mobileSidebarOpen ? ' dash-sidebar-open' : ''}`}>
        <a className="dash-brand" href="#dashboard" onClick={(event) => { event.preventDefault(); navigateSection('dashboard') }}>
          <span className="dash-brand-mark"><Icon name="spark" size={19} /></span>
          <span>Interview<span>AI</span></span>
        </a>
        <nav className="dash-nav" aria-label="Main navigation">
          {navigation.map(([label, section, icon]) => (
            <button
              className={`dash-nav-item${activeSection === section ? ' is-active' : ''}`}
              type="button"
              key={label}
              onClick={() => navigateSection(section)}
            >
              <Icon name={icon} size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="dash-sidebar-bottom">
          <div className="dash-sidebar-user">
            <Avatar name={name} />
            <span className="dash-sidebar-user-copy"><strong>{name}</strong><small>Free Plan</small></span>
          </div>
          <button className="dash-nav-item dash-logout" type="button" onClick={logout}><Icon name="logout" /><span>Logout</span></button>
        </div>
      </aside>

      <main className="dash-main" id="dashboard">
        <header className="dash-topbar">
          <button className="dash-menu-toggle" type="button" aria-label="Open navigation" onClick={() => setMobileSidebarOpen(true)}><Icon name="spark" /></button>
          <div className="dash-greeting">
            <h1>Welcome back, {name}</h1>
            <p>Your journey to interview success starts here.</p>
          </div>
          <div className="dash-topbar-actions">
            <label className="dash-search">
              <Icon name="search" size={17} />
              <input aria-label="Search interviews" placeholder="Search interviews..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </label>
            <div className="dash-popover-wrap">
              <button className={`dash-round-button${notificationsOpen ? ' is-open' : ''}`} type="button" aria-label="Notifications" onClick={() => setNotificationsOpen((open) => !open)}><Icon name="bell" size={18} /></button>
              {notificationsOpen && <div className="dash-popover dash-notification-popover"><strong>{notifications.title}</strong><p>{notifications.message}</p></div>}
            </div>
          </div>
        </header>

        <section className="dash-resume-interview-card" id="practice">
          <div className="dash-resume-interview-copy">
            <h2>Start Your AI Interview</h2>
            <p>Upload your resume and customize your AI interview before you begin.</p>
          </div>
          <form className="dash-resume-workspace" id="resume" onSubmit={startResumeInterview}>
            <div className={`dash-upload-zone${configuration.selectedResume ? ' has-resume' : ''}`}>
              <span className="dash-upload-symbol"><Icon name="upload" size={22} /></span>
              <div className="dash-upload-copy">
                <strong>{configuration.selectedResume?.fileName || interviewConfiguration.uploadStatus.upload}</strong>
                <span>{configuration.selectedResume ? resumeMessage : interviewConfiguration.uploadStatus.formatDescription}</span>
              </div>
              <input ref={fileInput} className="dash-file-input" type="file" accept="application/pdf,.pdf" onChange={handleResumeSelection} />
              <button className="dash-secondary-button dash-upload-button" type="button" onClick={() => fileInput.current?.click()}>
                {configuration.selectedResume ? interviewConfiguration.uploadStatus.replace : interviewConfiguration.uploadStatus.upload}
              </button>
              {configuration.selectedResume && <button className="dash-remove-resume" type="button" onClick={removeResume}>Remove</button>}
            </div>
            {resumeMessage === copy.invalidResumeType && <p className="dash-resume-error" role="alert">{resumeMessage}</p>}
            <div className="dash-interview-fields">
              {[
                ['targetRole', interviewConfiguration.fields.targetRole, interviewConfiguration.options.targetRoles],
                ['experienceLevel', interviewConfiguration.fields.experienceLevel, interviewConfiguration.options.experienceLevels],
                ['duration', interviewConfiguration.fields.duration, interviewConfiguration.options.durations],
                ['difficulty', interviewConfiguration.fields.difficulty, interviewConfiguration.options.difficulties],
              ].map(([field, metadata, options]) => (
                <label className="dash-interview-field" key={field}>
                  <span>{metadata.label}</span>
                  <select
                    required
                    value={configuration[field]}
                    onChange={(event) => updateInterviewConfiguration(field, event.currentTarget.value)}
                  >
                    <option value="">{metadata.placeholder}</option>
                    {options.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
              ))}
            </div>
            {configurationError && <p className="dash-resume-error" role="alert">{configurationError}</p>}
            <div className="dash-resume-actions">
              <small className="dash-local-note">Demo preview · Resume stays in this browser and is not uploaded to a server.</small>
              <button className="dash-primary-button dash-resume-start" type="submit" disabled={!configuration.selectedResume}>
                Start Resume-Based Interview <span>→</span>
              </button>
            </div>
          </form>
          <div className="dash-resume-orbit" aria-hidden="true">
            <span className="dash-orbit dash-orbit-one" /><span className="dash-orbit dash-orbit-two" /><span className="dash-orbit dash-orbit-three" />
            <span className="dash-orbit-dot dash-dot-one" /><span className="dash-orbit-dot dash-dot-two" />
            <span className="dash-mic-core"><Icon name="file" size={32} /></span>
          </div>
        </section>

        <section className="dash-stat-grid" aria-label="Quick statistics">
          {statistics.map(({ id, icon, value, label, trend }) => (
            <article className="dash-card dash-stat-card" key={id}>
              <span className="dash-stat-icon"><Icon name={icon} size={22} /></span>
              <div className="dash-stat-value"><strong>{value}</strong><span>{label}</span></div>
              {trend && <small>{trend}</small>}
            </article>
          ))}
        </section>

        <section className="dash-compact-analysis">
          <section className="dash-performance" id="performance">
            <SectionTitle>Performance Overview</SectionTitle>
            <div className="dash-performance-content">
              <div className="dash-chart-card">
                <span>{performance.chart.title}</span>
                <svg className="dash-line-chart" viewBox="0 0 470 125" role="img" aria-label={performance.chart.accessibleDescription}>
                  <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#743cff" stopOpacity=".38" /><stop offset="100%" stopColor="#743cff" stopOpacity=".02" /></linearGradient><linearGradient id="chartLine"><stop stopColor="#438dff" /><stop offset="100%" stopColor="#a144ff" /></linearGradient></defs>
                  {performance.chart.gridLines.map((y) => <line key={y} x1="35" y1={y} x2="462" y2={y} className="dash-chart-gridline" />)}
                  {performance.chart.yAxisLabels.map((score, index) => <text key={score} x="5" y={98 - index * 20} className="dash-chart-y-label">{score}</text>)}
                  <path d={performance.chart.fillPath} fill="url(#chartFill)" />
                  <path d={performance.chart.linePath} fill="none" stroke="url(#chartLine)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  {performance.chart.points.map(({ x, y, date }) => <circle key={date} cx={x} cy={y} r="3.5" className="dash-chart-point" />)}
                  {performance.chart.points.map(({ x, date }) => <text key={date} x={x} y="119" textAnchor="middle" className="dash-chart-x-label">{date}</text>)}
                </svg>
              </div>
              <div className="dash-score-grid">
                {performance.breakdown.map(({ label, value, trend, percent }) => (
                  <article className="dash-score-card" key={label}>
                    <span>{label}</span><div><strong>{value}</strong><small>{trend}</small></div><i><b style={{ width: `${percent}%` }} /></i>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="dash-recent" id="recent">
            <SectionTitle>Recent Interviews</SectionTitle>
            <div className="dash-table-wrap">
              <table className="dash-interview-table">
                <thead><tr><th>Interview Role</th><th>Date</th><th>Score</th><th>Status</th><th>Report</th></tr></thead>
                <tbody>
                  {filteredInterviews.map((interview) => (
                    <tr key={interview.id}>
                      <td>{interview.role}</td><td>{interview.date}</td><td><strong>{interview.score}</strong></td><td><span className="dash-status">{interview.status}</span></td>
                      <td><button className="dash-report-button" type="button" onClick={() => setDialog({ title: 'Interview report preview', message: `Demo report for ${interview.role} on ${interview.date}: score ${interview.score}. ${copy.reportUnavailable}` })}>View Report</button></td>
                    </tr>
                  ))}
                  {filteredInterviews.length === 0 && <tr><td className="dash-empty-row" colSpan="5">{copy.emptyInterviews} “{search}”.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </section>

        <section className="dash-features-section">
          <SectionTitle>AI Interview Features</SectionTitle>
          <div className="dash-feature-grid">
            {features.map(([icon, title, description]) => (
              <article className="dash-card dash-feature-card" key={title}>
                <span className="dash-feature-icon"><Icon name={icon} size={17} /></span><div><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </section>
        <p className="dash-demo-note">{copy.demoNotice}</p>
      </main>

      {dialog && <div className="dash-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null) }}>
        <section className="dash-modal" role="dialog" aria-modal="true" aria-labelledby="dash-modal-title">
          <button className="dash-modal-close" type="button" aria-label="Close" onClick={() => setDialog(null)}><Icon name="close" size={19} /></button>
          <span className="dash-modal-icon"><Icon name="file" size={22} /></span>
          <h2 id="dash-modal-title">{dialog.title}</h2>
          <p>{dialog.message}</p>
          <button className="dash-primary-button dash-modal-action" type="button" onClick={() => setDialog(null)}>Got it</button>
        </section>
      </div>}
    </div>
  )
}

export default DashboardView
