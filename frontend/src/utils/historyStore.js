const RESUME_KEY = "interviewai_resume_history";
const INTERVIEW_KEY = "interviewai_interview_history";

function readList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function getResumeHistory() {
  return readList(RESUME_KEY);
}

export function addResumeHistory(resume) {
  const history = readList(RESUME_KEY);
  const item = {
    id: resume.id || `${Date.now()}`,
    fileName: resume.fileName || resume.filename || "Resume.pdf",
    uploadedAt: resume.uploadedAt || new Date().toISOString(),
    skills: Array.isArray(resume.skills) ? resume.skills : [],
    status: resume.status || "Processed",
  };
  localStorage.setItem(RESUME_KEY, JSON.stringify([item, ...history.filter(x => x.id !== item.id)]));
  return item;
}

export function getInterviewHistory() {
  return readList(INTERVIEW_KEY);
}

export function addInterviewHistory(interview) {
  const history = readList(INTERVIEW_KEY);
  const item = {
    id: interview.id || `${Date.now()}`,
    role: interview.role || interview.targetRole || "General Interview",
    date: interview.date || new Date().toISOString(),
    duration: interview.duration || interview.duration_minutes || null,
    score: interview.score ?? null,
    status: interview.status || "Started",
  };
  localStorage.setItem(INTERVIEW_KEY, JSON.stringify([item, ...history.filter(x => x.id !== item.id)]));
  return item;
}
