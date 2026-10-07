import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import interviewerAvatar from '../assets/Minimalist AI Interviewer Avatar.png'
import { getInterviewSession } from '../services/interviewService.js'
import './InterviewScreen.css'

const INTERVIEW_STATES = {
  AI_ASKING: 'AI_ASKING',
  YOUR_TURN: 'YOUR_TURN',
  ANSWERING: 'ANSWERING',
  ANALYZING: 'ANALYZING',
  INTERVIEW_COMPLETE: 'INTERVIEW_COMPLETE',
}

const STATUS_COPY = {
  [INTERVIEW_STATES.AI_ASKING]: 'AI is asking...',
  [INTERVIEW_STATES.YOUR_TURN]: 'Your turn to answer',
  [INTERVIEW_STATES.ANSWERING]: 'You are answering...',
  [INTERVIEW_STATES.ANALYZING]: 'Analyzing your response...',
}

function stateClass(state) {
  return state.toLowerCase().replace('_', '-')
}

function InterviewIcon({ name, size = 19 }) {
  const paths = {
    mic: <><rect x="9" y="2" width="6" height="13" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v4m-4 0h8" /></>,
    micOff: <><path d="m3 3 18 18M9 9v3a3 3 0 0 0 5.1 2.1M15 9V5a3 3 0 0 0-5.8-1M5 11a7 7 0 0 0 12 5m2-5a7 7 0 0 1-.5 2.6M12 18v4m-4 0h8" /></>,
    speaker: <><path d="M11 5 6 9H3v6h3l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13" /></>,
    speakerOff: <><path d="M11 5 6 9H3v6h3l5 4z" /><path d="m17 9 5 6m0-6-5 6" /></>,
    repeat: <><path d="m17 2 4 4-4 4" /><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4" /><path d="M21 13v2a3 3 0 0 1-3 3H3" /></>,
    camera: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3z" /></>,
    cameraOff: <><path d="m3 3 18 18M10 6h4a2 2 0 0 1 2 2v1l5-3v12l-3-1.8M16 16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 .6-1.4" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    spark: <><path d="m12 2 1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2Z" /><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" /></>,
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function InterviewHeader({ currentQuestion, totalQuestions, remainingSeconds, onEnd }) {
  const time = `${String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:${String(remainingSeconds % 60).padStart(2, '0')}`

  return (
    <header className="interview-header">
      <div className="interview-brand">
        <span className="interview-brand-mark"><InterviewIcon name="spark" size={18} /></span>
        <strong>InterviewAI</strong>
        <span className="interview-header-divider" />
        <span className="interview-header-name">Resume-Based Interview</span>
      </div>
      <div className="interview-header-progress" aria-label={`Question ${currentQuestion} of ${totalQuestions}`}>
        <strong>Question {currentQuestion} of {totalQuestions}</strong>
        <span className="interview-progress-dots">
          {Array.from({ length: totalQuestions }, (_, index) => (
            <i className={index + 1 === currentQuestion ? 'is-current' : index + 1 < currentQuestion ? 'is-done' : ''} key={index} />
          ))}
        </span>
      </div>
      <div className="interview-header-actions">
        <time>{time}</time>
        <span className="interview-connection"><i />Connected</span>
        <button className="interview-end-button" type="button" onClick={onEnd}>End Interview</button>
      </div>
    </header>
  )
}

function InterviewContextBar({ session, activeStage }) {
  return (
    <div className="interview-context-bar">
      <div className="interview-context-copy">
        <span>Interview based on <strong title={session.resumeName}>{session.resumeName}</strong></span>
        <span>Target Role: <strong>{session.targetRole}</strong></span>
      </div>
      <ol className="interview-stage-list" aria-label="Interview stages">
        {session.stages.map((stage, index) => (
          <li className={stage === activeStage ? 'is-active' : ''} key={stage}>
            <span>{stage}</span>
            {index < session.stages.length - 1 && <b aria-hidden="true">›</b>}
          </li>
        ))}
      </ol>
    </div>
  )
}

function CandidatePreview({ muted }) {
  return (
    <aside className="candidate-preview" aria-label="Candidate preview, camera unavailable">
      <div className="candidate-preview-placeholder"><span>A</span></div>
      <div className="candidate-preview-footer">
        <span><strong>You</strong><small>Camera unavailable · mic demo</small></span>
        <span className={`candidate-audio-indicator${muted ? ' is-muted' : ''}`} aria-label={muted ? 'Mock microphone indicator muted' : 'Mock microphone level indicator; no microphone input is connected'}>
          <InterviewIcon name={muted ? 'micOff' : 'mic'} size={14} />
          <i /><i /><i /><i />
        </span>
      </div>
    </aside>
  )
}

function InterviewerArea({ session, question, interviewState, muted, currentQuestion }) {
  return (
    <section className={`interviewer-area is-${stateClass(interviewState)}`} aria-label="AI interviewer">
      <div className="interviewer-topline">
        <div className="interviewer-identity">
          <span className="interviewer-eyebrow">AI INTERVIEWER</span>
          <strong>{session.interviewer.name}</strong>
          <span className={`interviewer-status is-${stateClass(interviewState)}`}>
            <i />{interviewState === INTERVIEW_STATES.AI_ASKING ? 'AI is asking' : interviewState === INTERVIEW_STATES.ANALYZING ? 'Analyzing response' : interviewState === INTERVIEW_STATES.INTERVIEW_COMPLETE ? 'Interview complete' : 'Your turn'}
          </span>
        </div>
        <CandidatePreview muted={muted} />
      </div>
      <div className="interviewer-visual" aria-hidden="true">
        <span className="interviewer-glow" />
        <span className="interviewer-ring interviewer-ring-one" />
        <span className="interviewer-ring interviewer-ring-two" />
        <img src={interviewerAvatar} alt="" />
      </div>
      <div className="interview-question-block">
        <div className={`interview-waveform${interviewState === INTERVIEW_STATES.AI_ASKING || interviewState === INTERVIEW_STATES.ANSWERING || interviewState === INTERVIEW_STATES.ANALYZING ? ' is-animated' : ''}`} aria-hidden="true">
          {Array.from({ length: 34 }, (_, index) => <i key={index} style={{ '--bar': `${12 + ((index * 19 + currentQuestion * 7) % 29)}px` }} />)}
        </div>
        <div className="interview-question-meta">
          <span className="interview-speaker-dot" /> AI Interviewer
          <span className="interview-followup-tag">{currentQuestion > 3 ? 'Next question' : 'Follow-up question'}</span>
        </div>
        <div className={`interview-turn-banner is-${stateClass(interviewState)}`} role="status">
          <strong>
            {interviewState === INTERVIEW_STATES.AI_ASKING ? 'AI IS ASKING' : interviewState === INTERVIEW_STATES.YOUR_TURN ? 'YOUR TURN' : interviewState === INTERVIEW_STATES.ANSWERING ? 'YOU ARE ANSWERING' : interviewState === INTERVIEW_STATES.ANALYZING ? 'ANALYZING RESPONSE' : 'INTERVIEW COMPLETE'}
          </strong>
          <span>
            {interviewState === INTERVIEW_STATES.AI_ASKING ? 'Please listen to the question' : interviewState === INTERVIEW_STATES.YOUR_TURN ? 'Your turn to answer' : interviewState === INTERVIEW_STATES.ANSWERING ? 'You are answering...' : interviewState === INTERVIEW_STATES.ANALYZING ? 'Evaluating your answer and preparing the next question.' : 'Your interview has finished.'}
          </span>
        </div>
        <h1>{question.text}</h1>
        <p>{question.context}</p>
        <div className="interview-live-caption"><span>CC</span>{question.text}</div>
      </div>
    </section>
  )
}

function ConversationPanel({ transcript, onClose, interviewState }) {
  const transcriptEnd = useRef(null)

  useEffect(() => {
    transcriptEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [transcript])

  return (
    <aside className="conversation-panel">
      <header className="conversation-header">
        <h2>Conversation</h2>
        <button className="conversation-close-mobile" type="button" onClick={onClose} aria-label="Close conversation"><InterviewIcon name="close" size={18} /></button>
        <InterviewIcon name="chevron" size={18} />
      </header>
      <div className="conversation-messages" aria-live="polite">
        {transcript.map((message) => (
          <article className={`conversation-message is-${message.speaker}${message.followUp ? ' is-follow-up' : ''}`} key={message.id}>
            <div className="conversation-message-label">
              <span>{message.label}</span>
              {message.followUp && <em>Follow-up</em>}
            </div>
            <p>{message.text}</p>
          </article>
        ))}
        {(interviewState === INTERVIEW_STATES.YOUR_TURN || interviewState === INTERVIEW_STATES.ANSWERING) && (
          <div className={`conversation-turn-prompt${interviewState === INTERVIEW_STATES.ANSWERING ? ' is-answering' : ''}`} role="status">
            {interviewState === INTERVIEW_STATES.YOUR_TURN ? 'Your turn to respond...' : 'You are answering...'}
          </div>
        )}
        <div ref={transcriptEnd} />
      </div>
    </aside>
  )
}

function VoiceControls({ interviewState, muted, speakerOn, cameraOn, onToggleMic, onMute, onSpeaker, onRepeat, onCamera }) {
  const status = STATUS_COPY[interviewState]
  const micDisabled = interviewState === INTERVIEW_STATES.AI_ASKING || interviewState === INTERVIEW_STATES.ANALYZING
  const micAction = {
    [INTERVIEW_STATES.AI_ASKING]: 'Mic Locked',
    [INTERVIEW_STATES.YOUR_TURN]: 'Start Answer',
    [INTERVIEW_STATES.ANSWERING]: 'Finish Answer',
    [INTERVIEW_STATES.ANALYZING]: 'Analyzing...',
  }[interviewState]
  const instruction = {
    [INTERVIEW_STATES.AI_ASKING]: 'Please listen to the interviewer',
    [INTERVIEW_STATES.YOUR_TURN]: 'Your turn — click the mic to start answering',
    [INTERVIEW_STATES.ANSWERING]: "You're answering — click the mic when you're finished",
    [INTERVIEW_STATES.ANALYZING]: 'Your response is being analyzed',
  }[interviewState]

  return (
    <section className="voice-controls" aria-label="Interview voice controls">
      <div className={`interview-state-track is-${stateClass(interviewState)}`} aria-label={`Interview state: ${status}`}>
        <span className={interviewState === INTERVIEW_STATES.AI_ASKING ? 'is-active' : ''}>AI ASKING</span><b>›</b>
        <span className={interviewState === INTERVIEW_STATES.YOUR_TURN || interviewState === INTERVIEW_STATES.ANSWERING ? 'is-active' : ''}>YOUR TURN</span><b>›</b>
        <span className={interviewState === INTERVIEW_STATES.ANALYZING ? 'is-active' : ''}>ANALYZING</span>
      </div>
      <div className="voice-control-row">
        <button className={`voice-side-control${muted ? ' is-on' : ''}`} type="button" onClick={onMute} aria-pressed={muted}>
          <span><InterviewIcon name={muted ? 'micOff' : 'mic'} /></span>Mute
        </button>
        <button className={`voice-side-control${!speakerOn ? ' is-on' : ''}`} type="button" onClick={onSpeaker} aria-pressed={!speakerOn}>
          <span><InterviewIcon name={speakerOn ? 'speaker' : 'speakerOff'} /></span>Speaker
        </button>
        <div className={`main-mic-control is-${stateClass(interviewState)}`}>
          <div className={`main-mic-wrap is-${stateClass(interviewState)}`}>
          <span className="main-mic-rings" aria-hidden="true" />
          <button className="main-mic-button" type="button" onClick={onToggleMic} disabled={micDisabled} aria-label={micAction}>
            <InterviewIcon name={micDisabled ? 'micOff' : 'mic'} size={27} />
          </button>
          </div>
          <span className="main-mic-action">{micAction}</span>
        </div>
        <button className="voice-side-control" type="button" onClick={onRepeat}>
          <span><InterviewIcon name="repeat" /></span>Repeat
        </button>
        <button className={`voice-side-control${cameraOn ? ' is-on' : ''}`} type="button" onClick={onCamera} aria-pressed={cameraOn}>
          <span><InterviewIcon name={cameraOn ? 'camera' : 'cameraOff'} /></span>Camera
        </button>
      </div>
      <strong className={`voice-main-status is-${stateClass(interviewState)}`}>{status}</strong>
      <p>{interviewState === INTERVIEW_STATES.ANSWERING ? 'Speak your answer · mock recording only, no speech is transcribed' : interviewState === INTERVIEW_STATES.ANALYZING ? 'Mock analysis · no AI analysis is connected' : interviewState === INTERVIEW_STATES.YOUR_TURN ? 'Speak your answer, then click the microphone button when you are finished.' : instruction}</p>
    </section>
  )
}

export default function InterviewScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const configuration = location.state?.interviewConfiguration
  const [session, setSession] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(3)
  const [transcript, setTranscript] = useState([])
  const [interviewState, setInterviewState] = useState(INTERVIEW_STATES.AI_ASKING)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [muted, setMuted] = useState(false)
  const [speakerOn, setSpeakerOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(false)
  const [conversationOpen, setConversationOpen] = useState(true)
  const [questionReplay, setQuestionReplay] = useState(0)
  const transitionTimeout = useRef(null)
  const question = useMemo(() => (
    session?.questions.find((item) => item.number === currentQuestion)
  ), [session, currentQuestion])

  useEffect(() => {
    if (!configuration?.selectedResume?.fileName) return undefined
    let active = true
    getInterviewSession({
      interviewId: `demo-${Date.now()}`,
      resumeName: configuration.selectedResume.fileName,
      targetRole: configuration.targetRole,
      experienceLevel: configuration.experienceLevel,
      duration: configuration.duration,
      difficulty: configuration.difficulty,
    }).then((data) => {
      if (!active) return
      setSession(data)
      setCurrentQuestion(data.currentQuestion)
      setTranscript(data.transcript)
      setRemainingSeconds(data.remainingSeconds)
    }).catch((error) => {
      if (active) setLoadError(error.message || 'The interview session could not be loaded.')
    })
    return () => { active = false }
  }, [configuration])

  useEffect(() => {
    if (interviewState !== INTERVIEW_STATES.AI_ASKING || !question) return undefined
    const timeout = window.setTimeout(
      () => setInterviewState(INTERVIEW_STATES.YOUR_TURN),
      question.speakingDuration,
    )
    return () => window.clearTimeout(timeout)
  }, [interviewState, question, questionReplay])

  useEffect(() => {
    if (!session) return undefined
    const interval = window.setInterval(() => {
      setRemainingSeconds((remaining) => Math.max(0, remaining - 1))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [session])

  useEffect(() => () => window.clearTimeout(transitionTimeout.current), [])

  const openReport = useCallback(() => {
    if (!session) {
      navigate('/dashboard')
      return
    }
    navigate('/interview/report', { state: { session: { ...session, currentQuestion, transcript, sessionStatus: 'completed' } } })
  }, [currentQuestion, navigate, session, transcript])

  useEffect(() => {
    if (session && remainingSeconds === 0) openReport()
  }, [openReport, remainingSeconds, session])

  function handleMicrophone() {
    if (interviewState === INTERVIEW_STATES.YOUR_TURN) {
      setInterviewState(INTERVIEW_STATES.ANSWERING)
      return
    }
    if (interviewState !== INTERVIEW_STATES.ANSWERING || !session) return
    setInterviewState(INTERVIEW_STATES.ANALYZING)
    window.clearTimeout(transitionTimeout.current)
    transitionTimeout.current = window.setTimeout(() => {
      const answer = {
        id: `transcript-answer-${currentQuestion}`,
        speaker: 'candidate',
        label: 'You',
        text: session.demoAnswer,
      }
      if (currentQuestion >= session.totalQuestions) {
        const finalTranscript = [...transcript, answer]
        setTranscript(finalTranscript)
        setInterviewState(INTERVIEW_STATES.INTERVIEW_COMPLETE)
        return
      }
      const nextQuestionNumber = currentQuestion + 1
      const nextQuestion = session.questions.find((item) => item.number === nextQuestionNumber)
      setTranscript((current) => [
        ...current,
        answer,
        {
          id: `transcript-question-${nextQuestionNumber}`,
          speaker: 'ai',
          label: 'AI Interviewer',
          followUp: true,
          text: nextQuestion.text,
        },
      ])
      setCurrentQuestion(nextQuestionNumber)
      setInterviewState(INTERVIEW_STATES.AI_ASKING)
    }, 1900)
  }

  function repeatQuestion() {
    if (interviewState !== INTERVIEW_STATES.AI_ASKING) return
    setQuestionReplay((current) => current + 1)
  }

  if (!configuration?.selectedResume?.fileName) return <Navigate to="/dashboard" replace />
  if (loadError) return <main className="interview-error" role="alert"><h1>Interview could not be loaded</h1><p>{loadError}</p><button type="button" onClick={() => navigate('/dashboard')}>Back to Dashboard</button></main>
  if (!session || !question) return <main className="interview-loading" role="status">Preparing your interview...</main>
  if (interviewState === INTERVIEW_STATES.INTERVIEW_COMPLETE) {
    return (
      <main className="real-time-interview">
        <section className="interview-complete-card" aria-labelledby="interview-complete-title">
          <span aria-hidden="true">🎉</span>
          <h1 id="interview-complete-title">Interview Complete</h1>
          <p>Your interview has finished.</p>
          <button type="button" onClick={openReport}>View Interview Report <span aria-hidden="true">→</span></button>
        </section>
      </main>
    )
  }

  return (
    <main className={`real-time-interview${conversationOpen ? '' : ' conversation-collapsed'}`}>
      <InterviewHeader currentQuestion={currentQuestion} totalQuestions={session.totalQuestions} remainingSeconds={remainingSeconds} onEnd={openReport} />
      <InterviewContextBar session={session} activeStage={question.stage} />
      <div className="interview-workspace">
        <div className="interview-main-column">
          <InterviewerArea session={session} question={question} interviewState={interviewState} muted={muted} currentQuestion={currentQuestion} />
          <VoiceControls
            interviewState={interviewState}
            muted={muted}
            speakerOn={speakerOn}
            cameraOn={cameraOn}
            onToggleMic={handleMicrophone}
            onMute={() => setMuted((value) => !value)}
            onSpeaker={() => setSpeakerOn((value) => !value)}
            onRepeat={repeatQuestion}
            onCamera={() => setCameraOn((value) => !value)}
          />
        </div>
        {conversationOpen
          ? <ConversationPanel transcript={transcript} onClose={() => setConversationOpen(false)} interviewState={interviewState} />
          : <button className="conversation-open-button" type="button" onClick={() => setConversationOpen(true)}>Conversation <InterviewIcon name="chevron" size={17} /></button>}
      </div>
    </main>
  )
}
