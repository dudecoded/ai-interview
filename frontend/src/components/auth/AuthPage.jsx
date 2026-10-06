import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthButton from './AuthButton.jsx'
import AuthFooter from './AuthFooter.jsx'
import AuthForm from './AuthForm.jsx'
import AuthHeader from './AuthHeader.jsx'
import AuthInput from './AuthInput.jsx'
import AuthLayout from './AuthLayout.jsx'
import AuthModeTabs from './AuthModeTabs.jsx'
import AuthPanel from './AuthPanel.jsx'
import SocialAuth from './SocialAuth.jsx'
import './AuthPage.css'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AuthPage({ mode }) {
  const isSignup = mode === 'signup'
  const navigate = useNavigate()
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
    navigate('/dashboard', { replace: true })
  }

  function togglePassword(field) {
    setVisible((current) => ({ ...current, [field]: !current[field] }))
  }

  return (
    <AuthLayout mode={mode}>
      <AuthPanel>
        <AuthHeader mode={mode} />
        <AuthModeTabs mode={mode} />

        <AuthForm onSubmit={handleSubmit}>
          <div className="auth-field-stack">
            {isSignup && (
              <AuthInput id="name" label="Full Name" value={values.name} onChange={updateValue} autoComplete="name" />
            )}
            <AuthInput id="email" type="email" label="Enter your email" value={values.email} onChange={updateValue} autoComplete="email" />
            <AuthInput
              id="password"
              type="password"
              label="Enter your password"
              value={values.password}
              onChange={updateValue}
              visible={visible.password}
              onToggle={() => togglePassword('password')}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              minLength={8}
            />
            {isSignup && (
              <AuthInput
                id="confirmPassword"
                type="password"
                label="Confirm your password"
                value={values.confirmPassword}
                onChange={updateValue}
                visible={visible.confirmPassword}
                onToggle={() => togglePassword('confirmPassword')}
                autoComplete="new-password"
                minLength={8}
              />
            )}
          </div>

          {!isSignup && (
            <div className="auth-login-options">
              <label className="auth-remember-option">
                <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
                <span>Remember me</span>
              </label>
              <button className="auth-text-link" type="button" onClick={() => setMessage('Password reset is not connected yet.')}>Forgot password?</button>
            </div>
          )}

          {message && <p className="auth-form-message" role="status">{message}</p>}
          <AuthButton mode={mode} />
        </AuthForm>

        <div className="auth-divider"><span>or continue with</span></div>
        <SocialAuth />

        <AuthFooter mode={mode} />
      </AuthPanel>
    </AuthLayout>
  )
}
