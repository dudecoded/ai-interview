import { useEffect, useState } from "react";
import { getInterviewHistory } from "../utils/historyStore.js";
import "../styles/historyPages.css";

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString();
}

export default function MyInterviews({ onStartInterview, onViewReport }) {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const refresh = () => setInterviews(getInterviewHistory());
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("interview-history-updated", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("interview-history-updated", refresh);
    };
  }, []);

  const completed = interviews.filter(item => (item.status || "").toLowerCase() === "completed").length;

  return (
    <main className="history-page">
      <div className="history-page-heading">
        <div>
          <p className="history-eyebrow">YOUR PRACTICE</p>
          <h1>My Interviews</h1>
          <p className="history-subtitle">Review your interview sessions and track your practice history.</p>
        </div>
        {onStartInterview && <button className="history-primary-btn" onClick={onStartInterview}>＋ Practice Interview</button>}
      </div>

      <section className="history-summary-grid">
        <article className="history-summary-card"><span className="history-summary-icon">☷</span><div><span>Total interviews</span><strong>{interviews.length}</strong></div></article>
        <article className="history-summary-card"><span className="history-summary-icon">✓</span><div><span>Completed</span><strong>{completed}</strong></div></article>
        <article className="history-summary-card"><span className="history-summary-icon">◷</span><div><span>In progress</span><strong>{interviews.length - completed}</strong></div></article>
      </section>

      <section className="history-panel">
        <div className="history-panel-heading"><div><h2>Interview history</h2><p>Role, date, duration, score, and status for each session.</p></div></div>
        {interviews.length === 0 ? (
          <div className="history-empty">
            <span className="history-empty-icon">☷</span>
            <h3>No interviews yet</h3>
            <p>Your sessions will appear here after you start practicing. Upload a resume first if you haven't already.</p>
            {onStartInterview && <button className="history-primary-btn" onClick={onStartInterview}>Start practicing</button>}
          </div>
        ) : (
          <div className="history-table-wrap"><table className="history-table">
            <thead><tr><th>Interview role</th><th>Date</th><th>Duration</th><th>Score</th><th>Status</th><th>Report</th></tr></thead>
            <tbody>{interviews.map(item => (
              <tr key={item.id}>
                <td><strong>{item.role}</strong></td>
                <td>{formatDate(item.date)}</td>
                <td>{item.duration ? `${item.duration} min` : "—"}</td>
                <td><strong>{item.score == null ? "—" : `${item.score}%`}</strong></td>
                <td><span className={`history-status ${(item.status || "").toLowerCase() === "completed" ? "history-status-success" : "history-status-pending"}`}>{item.status || "Started"}</span></td>
                <td>{onViewReport && item.status?.toLowerCase() === "completed" ? <button className="history-link-btn" onClick={() => onViewReport(item)}>View report →</button> : "—"}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </section>
      <p className="history-footnote">History on this page is stored in this browser. For real user-specific history, populate it from your FastAPI interviews endpoint.</p>
    </main>
  );
}
