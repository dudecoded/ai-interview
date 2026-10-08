import mockDashboardData from '../data/mockDashboardData.js'

const API_URL = import.meta.env.VITE_API_URL
const TOKEN_KEY = 'interviewai.accessToken'

async function getDashboard() {
  const token = localStorage.getItem(TOKEN_KEY)

  if (!token) {
    throw new Error('You are not logged in')
  }

  const response = await fetch(`${API_URL}/dashboard/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to load dashboard')
  }

  return data
}

export async function getDashboardData() {
  const data = await getDashboard()

  const averageScore = data.average_score ?? 0

  return {
    ...mockDashboardData,

    dataSource: 'backend',

    profile: {
      ...mockDashboardData.profile,
      name: data.user?.name || 'User',
    },

    statistics: [
      {
        id: 'total-interviews',
        icon: 'list',
        value: String(data.interview_count ?? 0),
        label: 'Total Interviews',
        trend: '',
      },
      {
        id: 'average-score',
        icon: 'target',
        value: `${averageScore * 10}%`,
        label: 'Average Score',
        trend: '',
      },
      {
        id: 'completed-interviews',
        icon: 'clock',
        value: String(data.completed_interviews ?? 0),
        label: 'Completed Interviews',
        trend: '',
      },
      {
        id: 'resumes',
        icon: 'file',
        value: String(data.resume_count ?? 0),
        label: 'Resumes',
        trend: '',
      },
    ],

    interviewConfiguration: {
      ...mockDashboardData.interviewConfiguration,
      selectedResume: null,
    },

    copy: {
      ...mockDashboardData.copy,
      demoNotice:
        'Live dashboard data · Interview statistics are connected to the backend.',
    },
  }
}