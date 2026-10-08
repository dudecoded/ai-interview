const API_URL = import.meta.env.VITE_API_URL
const TOKEN_KEY = 'interviewai.accessToken'

function getToken() {
  const token = localStorage.getItem(TOKEN_KEY)

  if (!token) {
    throw new Error('You are not logged in')
  }

  return token
}

export async function getInterviewReport(session = {}) {
  const interviewId = session.interviewId

  if (!interviewId) {
    throw new Error('Interview ID is missing')
  }

  const token = getToken()

  const response = await fetch(
    `${API_URL}/interview/${interviewId}/result`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.message ||
        'The interview report could not be loaded.'
    )
  }

  return transformReport(data, session)
}

function transformReport(data, session) {
  const overallScore = Number(data.overall_score ?? 0)
  const maximumScore = Number(data.maximum_score ?? 50)

  const technicalScore = Number(data.technical_score ?? 0)
  const communicationScore = Number(data.communication_score ?? 0)
  const problemSolvingScore = Number(
    data.problem_solving_score ?? 0
  )
  const confidenceScore = Number(
    data.confidence_score ?? 0
  )

  const strengths = Array.isArray(data.strengths)
    ? data.strengths
    : []

  const improvements = Array.isArray(data.improvements)
    ? data.improvements
    : []

  const suggestions = Array.isArray(data.suggestions)
    ? data.suggestions
    : []

  const questions = Array.isArray(data.questions)
    ? data.questions.map((item) => ({
        number: item.number,
        question: item.question,
        answer: item.answer,
        score: item.score,
        feedback: item.feedback,
        category: item.category,
      }))
    : []

  return {
    candidate: {
      name: session.candidateName || 'Candidate',
      role: session.targetRole || 'Interview Candidate',
      experienceLevel:
        session.experienceLevel || 'Entry Level',
      resume: session.resumeName || 'Resume',
    },

    interview: {
      type: session.interviewType || 'AI Interview',
      difficulty: session.difficulty || 'Mixed',
      duration: session.reportDuration || '10 min',
      totalQuestions:
        data.total_questions ||
        session.totalQuestions ||
        5,
      answeredQuestions:
        data.answers_submitted ||
        questions.length ||
        0,
    },

    overallScore,

    maximumScore,

    scoreInterpretation:
      getScoreInterpretation(
        overallScore,
        maximumScore
      ),

    improvementFromPrevious:
      'AI-generated performance analysis',

    averageScore: overallScore,

    performance: [
      {
        id: 'technical',
        name: 'Technical Knowledge',
        score: technicalScore,
        average: 70,
        color: '#7c5cff',
      },
      {
        id: 'communication',
        name: 'Communication',
        score: communicationScore,
        average: 70,
        color: '#4c8dff',
      },
      {
        id: 'problem-solving',
        name: 'Problem Solving',
        score: problemSolvingScore,
        average: 70,
        color: '#35d39a',
      },
      {
        id: 'confidence',
        name: 'Confidence',
        score: confidenceScore,
        average: 70,
        color: '#ffb347',
      },
    ],

    aiSummary:
      data.overall_feedback ||
      `You scored ${overallScore}/${maximumScore} in this interview.`,

    strengths,

    improvements,

    communication: [
      {
        id: 'speakingPace',
        name: 'Speaking Pace',
        value: communicationScore,
        display: `${communicationScore}%`,
        color: '#7c5cff',
      },
      {
        id: 'clarity',
        name: 'Clarity',
        value: communicationScore,
        display: `${communicationScore}%`,
        color: '#4c8dff',
      },
      {
        id: 'confidence',
        name: 'Confidence',
        value: confidenceScore,
        display: `${confidenceScore}%`,
        color: '#35d39a',
      },
      {
        id: 'fillerWords',
        name: 'Filler Words',
        value: Math.max(
          0,
          100 - communicationScore
        ),
        display: `${Math.max(
          0,
          100 - communicationScore
        )}%`,
        color: '#ffb347',
      },
    ],

    questions,

    recommendations: suggestions,

    nextPractice: {
      title: 'Continue Interview Practice',
      description:
        suggestions[0] ||
        'Practice the areas identified in your performance report.',
    },

    reportNote:
      'This report was generated from your completed AI interview.',
  }
}

function getScoreInterpretation(score, maximumScore) {
  const percentage =
    maximumScore > 0
      ? (score / maximumScore) * 100
      : 0

  if (percentage >= 85) {
    return 'Excellent performance'
  }

  if (percentage >= 70) {
    return 'Good performance'
  }

  if (percentage >= 50) {
    return 'Needs improvement'
  }

  return 'More practice recommended'
}