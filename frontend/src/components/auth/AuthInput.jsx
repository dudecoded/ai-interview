export default function AuthInput({ id, label, type = 'text', value, onChange, autoComplete, minLength, visible, onToggle }) {
  const inputType = type === 'password' && visible ? 'text' : type
  const icon = type === 'email'
    ? <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>
    : type === 'password'
      ? <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>
      : <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>

  return (
    <label className={`auth-field auth-field-${type}`} htmlFor={id}>
      <svg className="auth-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg>
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
          className="auth-visibility-toggle"
          type="button"
          onClick={onToggle}
          aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {visible ? <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></> : <><path d="m3 3 18 18M10.6 5.2A9.8 9.8 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.1 3.8M6.2 6.3C3.5 8.1 2 12 2 12s3.6 7 10 7c1.3 0 2.4-.3 3.4-.7" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>}
          </svg>
        </button>
      )}
    </label>
  )
}
