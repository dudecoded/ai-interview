import { useEffect, useState } from 'react'
import AuthContext from './AuthContext.js'
import { login as apiLogin, register as apiRegister } from '../services/authService.js'

const TOKEN_KEY = 'interviewai.accessToken'
const USER_KEY = 'interviewai.user'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_KEY)
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY)

    if (!savedToken) {
      setUser(null)
    }
  }, [])

  async function login(email, password) {
    const data = await apiLogin(email, password)

    const userData = {
      id: data.user_id,
      name: data.name,
      email: data.email,
    }

    localStorage.setItem(TOKEN_KEY, data.access_token)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))

    setUser(userData)

    return data
  }

  async function register(name, email, password) {
    const data = await apiRegister(name, email, password)

    return data
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}