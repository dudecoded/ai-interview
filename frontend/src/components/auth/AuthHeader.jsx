export default function AuthHeader({ mode }) {
  const isSignup = mode === 'signup'

  return (
    <header className="auth-form-header">
      <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
      <p>{isSignup ? 'Join thousands of learners improving their interview skills.' : 'Sign in to continue your interview journey'}</p>
    </header>
  )
}
