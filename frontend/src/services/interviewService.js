import mockInterviewData from '../data/mockInterviewData.js'

export async function getInterviewSession(configuration = {}) {
  return {
    ...mockInterviewData,
    ...configuration,
    interviewer: { ...mockInterviewData.interviewer },
    stages: [...mockInterviewData.stages],
    questions: mockInterviewData.questions.map((question) => ({ ...question })),
    transcript: mockInterviewData.transcript.map((message) => ({ ...message })),
  }
}
