const API_URL = import.meta.env.VITE_API_URL

export async function login(email, password) {
  const params = new URLSearchParams({
    email,
    password,
  })

  const response = await fetch(`${API_URL}/auth/login?${params}`, {
    method: 'POST',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Login failed')
  }

  return data
}

export async function register(name, email, password) {
  const params = new URLSearchParams({
    name,
    email,
    password,
  })

  const response = await fetch(`${API_URL}/auth/register?${params}`, {
    method: 'POST',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Registration failed')
  }

  return data
}
