import { useState } from 'react'
import { Link } from 'react-router-dom'
import workspaceIllustration from '../../assets/Neon AI Assistant Workspace.png'
import workspaceBackground from '../../assets/Neon Holographic Workspace Dashboard.png'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const featureSets = {
  login: [
    ['voice', 'Realistic Voice Interviews'],
    ['chart', 'AI-Powered Evaluation'],
    ['questions', 'Personalized Questions'],
    ['report', 'Detailed Performance Reports'],
  ],
  signup: [
    ['bolt', 'Role-specific Questions'],
    ['adaptive', 'Adaptive Difficulty'],
    ['voice', 'Natural Voice Conversation'],
    ['chart', 'Performance Insights'],
  ],
}

function RobotMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 8V4m-3 0h6M13 15l-4-4m26 4 4-4" />
      <rect x="8" y="14" width="32" height="25" rx="8" />
      <path d="M16 39v4m16-4v4" />
      <circle cx="19" cy="26" r="2" />
      <circle cx="29" cy="26" r="2" />
      <path d="M19 33h10" />
    </svg>
  )
}

function FeatureIcon({ name }) {
  const paths = {
    voice: <><path d="M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" /><path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v3m-4 0h8" /></>,
    chart: <><path d="M4 20h16" /><path d="M7 16v-5m5 5V5m5 11V9" /></>,
    questions: <><path d="M5 5h14v11H9l-4 3V5Z" /><path d="M9 9h6m-6 3h4" /></>,
    report: <><path d="M7 3h8l4 4v14H7V3Z" /><path d="M15 3v5h4M10 12h6m-6 4h6" /></>,
    bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z" />,
    adaptive: <><path d="M20 7v5h-5" /><path d="M19 12a7 7 0 1 1-2-5l3 5Z" /><path d="m10 12 2 2 4-4" /></>,
  }

  return (
    <span className="feature-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">{paths[name]}</svg>
    </span>
  )
}

function LeftPanel({ mode }) {
  const isSignup = mode === 'signup'

  return (
    <section
      className={`auth-left auth-left-${mode}`}
      aria-label="InterviewAI"
      style={{
        '--workspace-background': `url("${workspaceBackground}")`,
      }}
    >
      <a className="brand" href="/" aria-label="InterviewAI home">
        <RobotMark />
        <span>Interview<span className="brand-accent">AI</span></span>
      </a>
      <div className="left-copy">
        <span className="decorative-rule" aria-hidden="true" />
        <h1>
          {isSignup ? (
            <>Build Your<br />Career <span className="gradient-text">with AI</span></>
          ) : (
            <>Practice<br />Smarter.<br /><span className="gradient-text">Get Hired.</span></>
          )}
        </h1>
        <p>
          {isSignup
            ? 'Create your account and start practicing with our AI interview agent today.'
            : 'AI-powered mock interviews with real-time voice conversation, instant feedback and detailed reports.'}
        </p>
        <ul className="feature-list">
          {featureSets[mode].map(([icon, label]) => (
            <li key={label}>
              <FeatureIcon name={icon} />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="illustration-wrap">
        <img src={workspaceIllustration} alt="A person practicing an interview with an AI robot" />
      </div>
    </section>
  )
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="social-icon">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.09-1.92 3.27-4.75 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.28-1.93-6.15-4.53H2.16v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.85 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.16a11 11 0 0 0 0 9.9l3.69-2.84Z" />
      <path fill="#EA4335" d="M12 4.36c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0a11 11 0 0 0-9.84 6.05l3.69 2.84C6.72 6.29 9.14 4.36 12 4.36Z" />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="social-icon github-icon">
      <path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.92.1-.71.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.29-2.61 5.23-5.1 5.51.4.35.75 1.02.75 2.06v3.1c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  )
}

function EyeIcon({ visible }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="eye-icon">
      {visible ? (
        <>
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="m3 3 18 18M10.6 5.2A9.8 9.8 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.1 3.8M6.2 6.3C3.5 8.1 2 12 2 12s3.6 7 10 7c1.3 0 2.4-.3 3.4-.7" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </>
      )}
    </svg>
  )
}

function AuthInput({ id, label, type = 'text', value, onChange, visible, onToggle, autoComplete, minLength }) {
  const inputType = type === 'password' && visible ? 'text' : type
  return (
    <label className="auth-input" htmlFor={id}>
      <span className={`field-symbol field-symbol-${type}`} aria-hidden="true">
        {type === 'email' ? (
          <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
        ) : type === 'password' ? (
          <svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></svg>
        ) : (
          <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
        )}
      </span>
      <input
        id={id}
        name={id}
        type={inputType}
        placeholder={label}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required
        minLength={minLength}
        aria-label={label}
      />
      {type === 'password' && (
        <button
          className="visibility-toggle"
          type="button"
          onClick={onToggle}
          aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
        >
          <EyeIcon visible={visible} />
        </button>
      )}
    </label>
  )
}

function SocialLogin() {
  return (
    <div className="social-actions">
      <button className="social-button google-button" type="button">
        <GoogleIcon />
        <span>Continue with Google</span>
      </button>
      <button className="social-button github-button" type="button">
        <GithubIcon />
        <span>Continue with GitHub</span>
      </button>
    </div>
  )
}

function AuthCard({ mode }) {
  const isSignup = mode === 'signup'
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [visible, setVisible] = useState({ password: false, confirmPassword: false })
  const [rememberMe, setRememberMe] = useState(true)
  const [message, setMessage] = useState('')

  function updateValue(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!event.currentTarget.checkValidity()) {
      setMessage('Complete all required fields using a valid email address.')
      return
    }
    if (!emailPattern.test(values.email)) {
      setMessage('Enter a valid email address.')
      return
    }
    if (isSignup && values.password !== values.confirmPassword) {
      setMessage('Your passwords do not match.')
      return
    }
    setMessage('Authentication is not connected yet.')
  }

  return (
    <section className="auth-content" aria-label={isSignup ? 'Create account' : 'Sign in'}>
      <p className="auth-tagline">Your Personal<br />AI Interview Coach</p>
      <div className="auth-card">
        <header className="form-heading">
          <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
          <p>
            {isSignup
              ? 'Join thousands of learners improving their interview skills.'
              : 'Sign in to continue your interview journey'}
          </p>
        </header>

        {!isSignup && <SocialLogin />}
        {!isSignup && <div className="separator"><span>OR</span></div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-stack">
            {isSignup && (
              <AuthInput id="name" label="Full Name" value={values.name} onChange={updateValue} autoComplete="name" />
            )}
            <AuthInput id="email" type="email" label="Email address" value={values.email} onChange={updateValue} autoComplete="email" />
            <AuthInput
              id="password"
              type="password"
              label="Password"
              value={values.password}
              onChange={updateValue}
              visible={visible.password}
              onToggle={() => setVisible((current) => ({ ...current, password: !current.password }))}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              minLength={8}
            />
            {isSignup && (
              <AuthInput
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                value={values.confirmPassword}
                onChange={updateValue}
                visible={visible.confirmPassword}
                onToggle={() => setVisible((current) => ({ ...current, confirmPassword: !current.confirmPassword }))}
                autoComplete="new-password"
                minLength={8}
              />
            )}
          </div>

          {!isSignup && (
            <div className="login-options">
              <label className="remember-option">
                <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
                <span>Remember me</span>
              </label>
              <button className="text-link" type="button" onClick={() => setMessage('Password reset is not connected yet.')}>Forgot password?</button>
            </div>
          )}

          {message && <p className="form-message" role="status">{message}</p>}
          <button className="primary-button" type="submit">
            {isSignup ? 'Create Account' : 'Sign In'} <span aria-hidden="true">→</span>
          </button>
        </form>

        {isSignup && (
          <>
            <div className="separator"><span>OR</span></div>
            <SocialLogin />
          </>
        )}

        <p className="auth-switch">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign In' : 'Sign Up'}</Link>
        </p>
      </div>
    </section>
  )
}

export default function AuthPage({ mode }) {
  return (
    <main className={`auth-layout auth-layout-${mode}`}>
      <LeftPanel mode={mode} />
      <AuthCard mode={mode} />
    </main>
  )
}
