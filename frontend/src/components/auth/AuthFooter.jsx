import { Link } from 'react-router-dom'

export default function AuthFooter({ mode }) {
  const isSignup = mode === 'signup'

  return (
    <>
      <p className="auth-switch">
        {isSignup ? 'Already have an account?' : "Don't have an account?"}
        <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign In' : 'Sign Up'}</Link>
      </p>
      <Link className="auth-dashboard-link" to="/dashboard">Explore Dashboard <span aria-hidden="true">→</span></Link>
    </>
  )
}
