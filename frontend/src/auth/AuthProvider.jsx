import { useEffect, useState } from 'react'
import AuthContext from './AuthContext.js'

const NAME_KEY = 'interviewai.demoName'
const LEGACY_DEMO_SESSION_KEY = 'interviewai.demoSession'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    sessionStorage.removeItem(LEGACY_DEMO_SESSION_KEY)
  }, [])

  function updateName(name) {
    sessionStorage.setItem(NAME_KEY, name)
    setUser((currentUser) => currentUser ? { ...currentUser, name } : currentUser)
  }

  function logout() {
    sessionStorage.removeItem(NAME_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), updateName, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
