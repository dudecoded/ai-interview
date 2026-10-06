import { Link } from 'react-router-dom'

export default function AuthModeTabs({ mode }) {
  return (
    <nav className="auth-mode-tabs" aria-label="Authentication">
      <Link className={mode === 'login' ? 'is-active' : ''} to="/login" aria-current={mode === 'login' ? 'page' : undefined}>Login</Link>
      <Link className={mode === 'signup' ? 'is-active' : ''} to="/signup" aria-current={mode === 'signup' ? 'page' : undefined}>Sign Up</Link>
    </nav>
  )
}
