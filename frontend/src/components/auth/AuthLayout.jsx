import AuthBackground from './AuthBackground.jsx'
import AuthHero from './AuthHero.jsx'

export default function AuthLayout({ mode, children }) {
  return (
    <main className={`auth-screen auth-screen-${mode}`}>
      <AuthBackground />
      <div className="auth-screen-overlay" aria-hidden="true" />
      <div className="auth-layout-content">
        <AuthHero mode={mode} />
        <div className="auth-panel-column">
          <p className="auth-panel-tagline">Better Interviews.<br />Brighter Careers.</p>
          {children}
          <aside className="auth-technology-note">
            <span aria-hidden="true">✦</span>
            <p>Same AI technology used by<br />top tech companies for interview preparation.</p>
          </aside>
        </div>
      </div>
    </main>
  )
}
