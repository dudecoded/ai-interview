import { useRef } from 'react'
import AuthBrand from './AuthBrand.jsx'

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

function HeroFeatureIcon({ name }) {
  const paths = {
    voice: <><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3m-4 0h8" /></>,
    chart: <><path d="M4 20h16M7 16v-5m5 5V5m5 11V9" /></>,
    questions: <><path d="M5 5h14v11H9l-4 3V5Z" /><path d="M9 9h6m-6 3h4" /></>,
    report: <><path d="M7 3h8l4 4v14H7V3Z" /><path d="M15 3v5h4M10 12h6m-6 4h6" /></>,
    bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z" />,
    adaptive: <><path d="M20 7v5h-5" /><path d="M19 12a7 7 0 1 1-2-5l3 5Z" /><path d="m10 12 2 2 4-4" /></>,
  }

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function AuthHeroFeatures({ mode }) {
  return (
    <ul className="auth-hero-features">
      {featureSets[mode].map(([icon, label]) => (
        <li key={label}>
          <span className="auth-feature-icon"><HeroFeatureIcon name={icon} /></span>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  )
}

function HeroAccentCards({ accentsRef }) {
  return (
    <div ref={accentsRef} className="auth-hero-accents" aria-hidden="true">
      <div className="auth-floating-card auth-floating-card-one">
        <span className="auth-floating-icon">✦</span>
        <span><small>Analyze</small><strong>Your Answers</strong></span>
      </div>
      <div className="auth-floating-card auth-floating-card-two">
        <span className="auth-floating-icon">↗</span>
        <span><small>Instant AI</small><strong>Feedback</strong></span>
      </div>
    </div>
  )
}

function AuthHeroSocialProof() {
  return (
    <div className="auth-social-proof">
      <div className="auth-proof-avatars" aria-hidden="true"><i>A</i><i>M</i><i>J</i></div>
      <div>
        <strong>“Helped me crack my dream job!”</strong>
        <span className="auth-proof-stars" aria-label="5 out of 5 stars">★★★★★</span>
        <small>Trusted by 10,000+ job seekers</small>
      </div>
    </div>
  )
}

export default function AuthHero({ mode }) {
  const isSignup = mode === 'signup'
  const accentsRef = useRef(null)

  function handlePointerMove(event) {
    if (!accentsRef.current || event.pointerType !== 'mouse') return

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    accentsRef.current.style.setProperty('--auth-parallax-x', `${x * 5}px`)
    accentsRef.current.style.setProperty('--auth-parallax-y', `${y * 5}px`)
  }

  function handlePointerLeave() {
    if (!accentsRef.current) return
    accentsRef.current.style.setProperty('--auth-parallax-x', '0px')
    accentsRef.current.style.setProperty('--auth-parallax-y', '0px')
  }

  return (
    <section
      className={`auth-hero auth-hero-${mode}`}
      aria-label="InterviewAI"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <AuthBrand />
      <div className="auth-hero-copy">
        <span className="auth-hero-eyebrow">{isSignup ? 'YOUR NEXT CHAPTER STARTS HERE' : 'YOUR AI INTERVIEW COACH'}</span>
        <h1>
          {isSignup
            ? <>Build Your<br />Career <span>with AI</span></>
            : <>Practice Smarter.<br /><span>Get Hired.</span></>}
        </h1>
        <p>
          {isSignup
            ? 'Create your account and start practicing with your personal AI interview coach.'
            : 'AI-powered mock interviews with real-time voice conversation, instant feedback and detailed reports.'}
        </p>
        <AuthHeroFeatures mode={mode} />
      </div>
      <HeroAccentCards accentsRef={accentsRef} />
      <AuthHeroSocialProof />
    </section>
  )
}
