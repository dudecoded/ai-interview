const API_URL = import.meta.env.VITE_API_URL
const TOKEN_KEY = 'interviewai.accessToken'

function getToken() {
  const token = localStorage.getItem(TOKEN_KEY)

  if (!token) {
    throw new Error('You are not logged in')
  }

  return token
}

async function apiRequest(url, options = {}) {
  const token = getToken()

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || 'Interview request failed'
    )
  }

  return data
}

/**
 * Start a real AI interview.
 */
export async function startInterview({ resumeId = null } = {}) {
  const params = new URLSearchParams()

  if (resumeId) {
    params.set('resume_id', resumeId)
  }

  const query = params.toString()

  return apiRequest(
    `/interview/start${query ? `?${query}` : ''}`,
    {
      method: 'POST',
    }
  )
}

/**
 * Submit the candidate's answer.
 */
export async function submitAnswer({
  interviewId,
  question,
  answerText,
}) {
  const params = new URLSearchParams({
    interview_id: String(interviewId),
    question,
    answer_text: answerText,
  })

  return apiRequest(`/interview/answer?${params}`, {
    method: 'POST',
  })
}

/**
 * Finish the interview and generate the final AI report.
 */
export async function finishInterview(interviewId) {
  return apiRequest(`/interview/${interviewId}/finish`, {
    method: 'POST',
  })
}

/**
 * Get the saved final interview result.
 */
export async function getInterviewResult(interviewId) {
  return apiRequest(`/interview/${interviewId}/result`)
}