import sceneBackground from '../../assets/background.png'

export default function AuthBackground() {
  return (
    <div
      className="auth-scene-background"
      aria-hidden="true"
      style={{ '--auth-scene-image': `url("${sceneBackground}")` }}
    />
  )
}
