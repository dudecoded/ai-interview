import { useEffect, useState } from "react";
import { getResumeHistory } from "../utils/historyStore.js";
import "../styles/historyPages.css";

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString();
}

export default function MyResume({ onUploadClick }) {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const refresh = () => setResumes(getResumeHistory());
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("resume-history-updated", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("resume-history-updated", refresh);
    };
  }, []);

  return (
    <main className="history-page">
      <div className="history-page-heading">
        <div>
          <p className="history-eyebrow">YOUR PROFILE</p>
          <h1>My Resume</h1>
          <p className="history-subtitle">View the resumes you have uploaded and their processing status.</p>
        </div>
        {onUploadClick && <button className="history-primary-btn" onClick={onUploadClick}>＋ Upload Resume</button>}
      </div>

      <section className="history-summary-grid">
        <article className="history-summary-card"><span className="history-summary-icon">▤</span><div><span>Total uploads</span><strong>{resumes.length}</strong></div></article>
        <article className="history-summary-card"><span className="history-summary-icon">✓</span><div><span>Processed</span><strong>{resumes.filter(r => r.status === "Processed" || r.status.toLowerCase().includes("success")).length}</strong></div></article>
      </section>

      <section className="history-panel">
        <div className="history-panel-heading"><div><h2>Resume history</h2><p>Your recent uploads appear here.</p></div></div>
        {resumes.length === 0 ? (
          <div className="history-empty">
            <span className="history-empty-icon">▤</span>
            <h3>No resume uploaded yet</h3>
            <p>Upload a PDF resume from the Dashboard to see its name, upload date, and detected skills here.</p>
            {onUploadClick && <button className="history-primary-btn" onClick={onUploadClick}>Upload your first resume</button>}
          </div>
        ) : (
          <div className="history-table-wrap"><table className="history-table">
            <thead><tr><th>Resume</th><th>Uploaded</th><th>Skills detected</th><th>Status</th></tr></thead>
            <tbody>{resumes.map(resume => (
              <tr key={resume.id}>
                <td><span className="history-file-icon">PDF</span><strong>{resume.fileName}</strong></td>
                <td>{formatDate(resume.uploadedAt)}</td>
                <td>{resume.skills?.length ? `${resume.skills.length} skills` : "—"}</td>
                <td><span className="history-status history-status-success">{resume.status || "Processed"}</span></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </section>
      <p className="history-footnote">History on this page is stored in this browser. Connect it to your resume-history API for account-wide persistence.</p>
    </main>
  );
}
