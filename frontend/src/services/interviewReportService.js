import mockInterviewReport from '../data/mockInterviewReport.js'

export async function getInterviewReport(session = {}) {
  const candidate = {
    ...mockInterviewReport.candidate,
    name: session.candidateName || mockInterviewReport.candidate.name,
    role: session.targetRole || mockInterviewReport.candidate.role,
    experienceLevel: session.experienceLevel || mockInterviewReport.candidate.experienceLevel,
    resume: session.resumeName || mockInterviewReport.candidate.resume,
  }

  return {
    ...mockInterviewReport,
    candidate,
    interview: {
      ...mockInterviewReport.interview,
      type: session.interviewType || mockInterviewReport.interview.type,
      difficulty: session.difficulty || mockInterviewReport.interview.difficulty,
      duration: session.reportDuration || mockInterviewReport.interview.duration,
      totalQuestions: session.totalQuestions || mockInterviewReport.interview.totalQuestions,
      answeredQuestions: session.currentQuestion || mockInterviewReport.interview.answeredQuestions,
    },
    performance: mockInterviewReport.performance.map((metric) => ({ ...metric })),
    strengths: [...mockInterviewReport.strengths],
    improvements: [...mockInterviewReport.improvements],
    questions: mockInterviewReport.questions.map((question) => ({ ...question })),
    communication: mockInterviewReport.communication.map((metric) => ({ ...metric })),
    recommendations: [...mockInterviewReport.recommendations],
    nextPractice: { ...mockInterviewReport.nextPractice },
  }
}
