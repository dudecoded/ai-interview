import { useState } from 'react'
import ReportIcon from './ReportIcon.jsx'

export default function QuestionAnalysis({ questions, initialQuestion }) {
  const initialIndex = Math.max(0, questions.findIndex((question) => question.number === initialQuestion))
  const [selectedIndex, setSelectedIndex] = useState(initialIndex)
  const [showFullAnswer, setShowFullAnswer] = useState(false)
  const question = questions[selectedIndex]

  function changeQuestion(offset) {
    setSelectedIndex((index) => (index + offset + questions.length) % questions.length)
    setShowFullAnswer(false)
  }

  return (
    <section className="report-panel report-question-review">
      <div className="report-section-heading">
        <span className="report-heading-icon is-blue"><ReportIcon name="spark" size={18} /></span>
        <div><h2>Question by Question Review</h2></div>
        <div className="report-question-nav">
          <button type="button" onClick={() => changeQuestion(-1)} aria-label="Previous question"><ReportIcon name="left" size={14} /></button>
          <button type="button" onClick={() => changeQuestion(1)} aria-label="Next question"><ReportIcon name="right" size={14} /></button>
        </div>
      </div>
      <div className="report-question-content">
        <nav className="report-question-index" aria-label="Choose a question">
          {questions.map((item, index) => (
            <button
              type="button"
              key={item.number}
              className={index === selectedIndex ? 'is-active' : ''}
              aria-current={index === selectedIndex ? 'step' : undefined}
              onClick={() => { setSelectedIndex(index); setShowFullAnswer(false) }}
            >
              <i />Q{item.number}
            </button>
          ))}
        </nav>
        <article className="report-selected-question">
          <div className="report-selected-question-heading">
            <div>
              <span>Question {question.number} of {questions.length}</span>
              <em>{question.category}</em>
            </div>
            <strong>{question.score.toFixed(1)} / 10</strong>
          </div>
          <h3>{question.question}</h3>
          <div className="report-answer-card">
            <span className="report-answer-title"><i />Your Answer</span>
            <p className={showFullAnswer ? '' : 'is-truncated'}>{question.answer}</p>
            {question.answer.length > 150 && (
              <button type="button" onClick={() => setShowFullAnswer((shown) => !shown)}>
                {showFullAnswer ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
          <div className="report-question-feedback">
            <span className="report-answer-title"><i />AI Feedback</span>
            <p>{question.feedback}</p>
          </div>
        </article>
      </div>
    </section>
  )
}
