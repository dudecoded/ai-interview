import { useRef, useState } from 'react'
import DashboardIcon from '../DashboardIcon.jsx'

export default function ResumeInterviewSection({ interviewConfiguration, copy, onStartInterview }) {
  const [configuration, setConfiguration] = useState(() => ({
    selectedResume: interviewConfiguration.selectedResume,
    targetRole: interviewConfiguration.targetRole,
    experienceLevel: interviewConfiguration.experienceLevel,
    duration: interviewConfiguration.duration,
    difficulty: interviewConfiguration.difficulty,
  }))
  const [resumeMessage, setResumeMessage] = useState(interviewConfiguration.selectedResume?.status || '')
  const [configurationError, setConfigurationError] = useState('')
  const fileInput = useRef(null)

  function handleResumeSelection(event) {
    const file = event.currentTarget.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setResumeMessage(copy.invalidResumeType)
      event.currentTarget.value = ''
      return
    }
    setConfiguration((current) => ({ ...current, selectedResume: { fileName: file.name, status: copy.localResumeSelection, file } }))
    setResumeMessage(copy.localResumeSelection)
    setConfigurationError('')
    event.currentTarget.value = ''
  }

  function removeResume() {
    setConfiguration((current) => ({ ...current, selectedResume: null }))
    setResumeMessage('')
    setConfigurationError('')
  }

  function updateInterviewConfiguration(field, value) {
    setConfiguration((current) => ({ ...current, [field]: value }))
    setConfigurationError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!configuration.selectedResume || !configuration.targetRole || !configuration.experienceLevel || !configuration.duration || !configuration.difficulty) {
      setConfigurationError('Upload a resume and complete every interview field before continuing.')
      return
    }
    onStartInterview(configuration)
  }

  return (
    <section className="dash-resume-interview-card" id="practice">
      <div className="dash-resume-interview-copy">
        <h2>Start Your AI Interview</h2>
        <p>Upload your resume and customize your AI interview before you begin.</p>
      </div>
      <form className="dash-resume-workspace" id="resume" onSubmit={handleSubmit}>
        <div className={`dash-upload-zone${configuration.selectedResume ? ' has-resume' : ''}`}>
          <span className="dash-upload-symbol"><DashboardIcon name="upload" size={22} /></span>
          <div className="dash-upload-copy">
            <strong>{configuration.selectedResume?.fileName || interviewConfiguration.uploadStatus.upload}</strong>
            <span>{configuration.selectedResume ? resumeMessage : interviewConfiguration.uploadStatus.formatDescription}</span>
          </div>
          <input ref={fileInput} className="dash-file-input" type="file" accept="application/pdf,.pdf" onChange={handleResumeSelection} />
          <button className="dash-secondary-button dash-upload-button" type="button" onClick={() => fileInput.current?.click()}>
            {configuration.selectedResume ? interviewConfiguration.uploadStatus.replace : interviewConfiguration.uploadStatus.upload}
          </button>
          {configuration.selectedResume && <button className="dash-remove-resume" type="button" onClick={removeResume}>Remove</button>}
        </div>
        {resumeMessage === copy.invalidResumeType && <p className="dash-resume-error" role="alert">{resumeMessage}</p>}
        <div className="dash-interview-fields">
          {[
            ['targetRole', interviewConfiguration.fields.targetRole, interviewConfiguration.options.targetRoles],
            ['experienceLevel', interviewConfiguration.fields.experienceLevel, interviewConfiguration.options.experienceLevels],
            ['duration', interviewConfiguration.fields.duration, interviewConfiguration.options.durations],
            ['difficulty', interviewConfiguration.fields.difficulty, interviewConfiguration.options.difficulties],
          ].map(([field, metadata, options]) => (
            <label className="dash-interview-field" key={field}>
              <span>{metadata.label}</span>
              <select required value={configuration[field]} onChange={(event) => updateInterviewConfiguration(field, event.currentTarget.value)}>
                <option value="">{metadata.placeholder}</option>
                {options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          ))}
        </div>
        {configurationError && <p className="dash-resume-error" role="alert">{configurationError}</p>}
        <div className="dash-resume-actions">
          <small className="dash-local-note">Demo preview · Resume stays in this browser and is not uploaded to a server.</small>
          <button className="dash-primary-button dash-resume-start" type="submit" disabled={!configuration.selectedResume}>
            Start Resume-Based Interview <span>→</span>
          </button>
        </div>
      </form>
      <div className="dash-resume-orbit" aria-hidden="true">
        <span className="dash-orbit dash-orbit-one" /><span className="dash-orbit dash-orbit-two" /><span className="dash-orbit dash-orbit-three" />
        <span className="dash-orbit-dot dash-dot-one" /><span className="dash-orbit-dot dash-dot-two" />
        <span className="dash-mic-core"><DashboardIcon name="file" size={32} /></span>
      </div>
    </section>
  )
}
