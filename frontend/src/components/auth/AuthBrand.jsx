export default function AuthBrand({ compact = false }) {
  return (
    <a className={`auth-brand${compact ? ' is-compact' : ''}`} href="/" aria-label="InterviewAI home">
      <span className="auth-brand-mark" aria-hidden="true">
        <svg viewBox="0 0 48 48">
          <path d="M24 8V4m-3 0h6M13 15l-4-4m26 4 4-4" />
          <rect x="8" y="14" width="32" height="25" rx="8" />
          <path d="M16 39v4m16-4v4" />
          <circle cx="19" cy="26" r="2" />
          <circle cx="29" cy="26" r="2" />
          <path d="M19 33h10" />
        </svg>
      </span>
      <span>Interview<span className="auth-brand-accent">AI</span></span>
    </a>
  )
}
