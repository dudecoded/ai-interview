const mockDashboardData = {
  dataSource: 'development-demo',
  profile: {
    name: 'Ashutosh',
    targetRole: 'Frontend Developer',
    experience: 'Beginner',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    completion: 75,
  },
  statistics: [
    { id: 'total-interviews', icon: 'list', value: '12', label: 'Total Interviews', trend: '↑ +3 this month' },
    { id: 'average-score', icon: 'target', value: '82%', label: 'Average Score', trend: '↑ +5%' },
    { id: 'practice-time', icon: 'clock', value: '6.5 Hours', label: 'Practice Time', trend: '↑ +1.2h' },
    { id: 'improvement', icon: 'trend', value: '+18%', label: 'Improvement', trend: '' },
  ],
  interviewConfiguration: {
    selectedResume: null,
    targetRole: 'Frontend Developer',
    experienceLevel: 'Beginner',
    duration: '30 Minutes',
    difficulty: 'Medium',
    options: {
      targetRoles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Software Engineer', 'Other'],
      experienceLevels: ['Beginner', 'Intermediate', 'Advanced'],
      durations: ['15 Minutes', '30 Minutes', '45 Minutes'],
      difficulties: ['Easy', 'Medium', 'Hard'],
    },
    fields: {
      targetRole: { label: 'Target Role', placeholder: 'Select a target role' },
      experienceLevel: { label: 'Experience Level', placeholder: 'Select an experience level' },
      duration: { label: 'Interview Duration', placeholder: 'Select a duration' },
      difficulty: { label: 'Interview Difficulty', placeholder: 'Select a difficulty' },
    },
    uploadStatus: {
      replace: 'Replace Resume',
      upload: 'Upload Resume',
      formatDescription: 'PDF format supported',
    },
  },
  performance: {
    chart: {
      title: 'Interview scores over time',
      yAxisLabels: [0, 25, 50, 75, 100],
      gridLines: [16, 42, 68, 94],
      points: [
        { x: 38, y: 87, date: 'Aug 20' },
        { x: 118, y: 72, date: 'Sep 1' },
        { x: 197, y: 78, date: 'Sep 10' },
        { x: 276, y: 58, date: 'Sep 18' },
        { x: 355, y: 43, date: 'Sep 28' },
        { x: 445, y: 36, date: 'Oct 2' },
      ],
      fillPath: 'M38 87 L118 72 L197 78 L276 58 L355 43 L445 36 L445 98 L38 98Z',
      linePath: 'M38 87 L118 72 L197 78 L276 58 L355 43 L445 36',
      accessibleDescription: 'Interview scores trend rising from 35 to 82 percent',
    },
    breakdown: [
      { label: 'Overall Performance', value: '82%', trend: '↑ 18%', percent: 82 },
      { label: 'Communication', value: '85%', trend: '↑ 9%', percent: 85 },
      { label: 'Technical Knowledge', value: '78%', trend: '↑ 12%', percent: 78 },
      { label: 'Confidence', value: '80%', trend: '↑ 7%', percent: 80 },
    ],
  },
  recentInterviews: [
    { id: 'interview-2026-10-02', role: 'Frontend Developer', date: 'Oct 2, 2026', score: '86%', status: 'Completed' },
    { id: 'interview-2026-09-28', role: 'UI Engineer', date: 'Sep 28, 2026', score: '79%', status: 'Completed' },
    { id: 'interview-2026-09-24', role: 'React Developer', date: 'Sep 24, 2026', score: '84%', status: 'Completed' },
  ],
  notifications: {
    title: 'You’re all caught up',
    message: 'New feedback and interview updates will appear here.',
  },
  features: [
    ['file', 'Resume-Based Questions', 'Questions tailored to your experience.'],
    ['mic', 'Real-Time AI Conversation', 'Practice speaking naturally.'],
    ['spark', 'Instant Feedback', 'Get useful feedback after practice.'],
    ['chart', 'Performance Report', 'Review scores and growth over time.'],
  ],
  navigation: [
    ['Dashboard', 'dashboard', 'grid'],
    ['Practice Interview', 'practice', 'mic'],
    ['My Interviews', 'recent', 'list'],
    ['My Resume', 'resume', 'file'],
    ['Performance Analytics', 'performance', 'chart'],
    ['Settings', 'settings', 'settings'],
  ],
  copy: {
    emptyInterviews: 'No interviews match',
    historyUnavailable: 'Your complete interview history will appear here. The current dashboard contains sample interview data only.',
    reportUnavailable: 'Detailed reports are not connected yet.',
    interviewUnavailable: 'This is a frontend preview. AI interview sessions are not connected yet.',
    settingsUnavailable: 'Account settings will be available here when account services are connected.',
    demoNotice: 'Demo data · Resume selection is local only · AI interviews are not connected.',
    localResumeSelection: 'Selected locally',
    invalidResumeType: 'Please choose a PDF file.',
  },
}

export default mockDashboardData
