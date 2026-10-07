import AuthBrand from './AuthBrand.jsx'

export default function AuthPanel({ children }) {
  return (
    <section className="auth-panel" aria-label="Account access">
      <div className="auth-panel-brand"><AuthBrand compact /></div>
      {children}
    </section>
  )
}
