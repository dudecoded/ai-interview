export default function AuthForm({ onSubmit, children }) {
  return <form className="auth-form" onSubmit={onSubmit} noValidate>{children}</form>
}
