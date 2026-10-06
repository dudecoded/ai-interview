import { useMemo } from 'react'

function SectionTitle({ children }) {
  return <div className="dash-section-title"><h2>{children}</h2></div>
}

function InterviewRow({ interview, onOpenReport }) {
  return (
    <tr>
      <td>{interview.role}</td>
      <td>{interview.date}</td>
      <td><strong>{interview.score}</strong></td>
      <td><span className="dash-status">{interview.status}</span></td>
      <td><button className="dash-report-button" type="button" onClick={() => onOpenReport(interview)}>View Report</button></td>
    </tr>
  )
}

export default function RecentInterviewsSection({ interviews, search, copy, onOpenReport }) {
  const filteredInterviews = useMemo(
    () => interviews
      .filter((interview) => `${interview.role} ${interview.date} ${interview.score} ${interview.status}`.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 3),
    [interviews, search],
  )

  return (
    <section className="dash-recent" id="recent">
      <SectionTitle>Recent Interviews</SectionTitle>
      <div className="dash-table-wrap">
        <table className="dash-interview-table">
          <thead><tr><th>Interview Role</th><th>Date</th><th>Score</th><th>Status</th><th>Report</th></tr></thead>
          <tbody>
            {filteredInterviews.map((interview) => (
              <InterviewRow key={interview.id} interview={interview} onOpenReport={onOpenReport} />
            ))}
            {filteredInterviews.length === 0 && <tr><td className="dash-empty-row" colSpan="5">{copy.emptyInterviews} “{search}”.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  )
}
