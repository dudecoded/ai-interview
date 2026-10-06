import DashboardIcon from './DashboardIcon.jsx'

export default function DashboardDialog({ dialog, onClose }) {
  if (!dialog) return null

  return (
    <div className="dash-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="dash-modal" role="dialog" aria-modal="true" aria-labelledby="dash-modal-title">
        <button className="dash-modal-close" type="button" aria-label="Close" onClick={onClose}><DashboardIcon name="close" size={19} /></button>
        <span className="dash-modal-icon"><DashboardIcon name="file" size={22} /></span>
        <h2 id="dash-modal-title">{dialog.title}</h2>
        <p>{dialog.message}</p>
        <button className="dash-primary-button dash-modal-action" type="button" onClick={onClose}>Got it</button>
      </section>
    </div>
  )
}
