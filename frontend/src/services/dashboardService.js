import mockDashboardData from '../data/mockDashboardData.js'

export async function getDashboardData() {
  return mockDashboardData
}

export async function getUserProfile() {
  return mockDashboardData.profile
}

export async function getDashboardStats() {
  return mockDashboardData.statistics
}

export async function getRecentInterviews() {
  return mockDashboardData.recentInterviews
}

export async function getPerformanceData() {
  return mockDashboardData.performance
}
