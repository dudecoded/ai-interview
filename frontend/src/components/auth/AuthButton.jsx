export default function AuthButton({ mode }) {
  return (
    <button className="auth-submit-button" type="submit">
      {mode === 'signup' ? 'Create Account' : 'Sign In'} <span aria-hidden="true">→</span>
    </button>
  )
}
