const API_URL = import.meta.env.VITE_API_URL
const TOKEN_KEY = 'interviewai.accessToken'

export async function uploadResume(file) {
  const token = localStorage.getItem(TOKEN_KEY)

  if (!token) {
    throw new Error('You are not logged in')
  }

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/resume/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Resume upload failed')
  }

  return data
}