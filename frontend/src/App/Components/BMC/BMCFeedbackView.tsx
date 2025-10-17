import React from 'react';
import ReactMarkdown from 'react-markdown';
import './feedback.css';

interface BMCFeedbackViewProps {
  feedback: string;
  onClose: () => void;
  isLoading?: boolean;
}

const BMCFeedbackView: React.FC<BMCFeedbackViewProps> = ({ feedback, onClose, isLoading }) => {
  // Extract grade from feedback if present (looking for patterns like "Grade: 3/5" or "Overall Grade: 4/5")
  const gradeMatch = feedback.match(/(?:Overall\s+)?Grade:\s*(\d)(?:\/5)?/i);
  const grade = gradeMatch ? gradeMatch[1] : null;

  return (
    <div className="feedback-view">
      <div className="feedback-header">
        <div className="feedback-title-section">
          <h2>Canvas Feedback</h2>
          {grade && (
            <div className="feedback-grade-badge">
              Grade: <span className="grade-value">{grade}/5</span>
            </div>
          )}
        </div>
        <button className="feedback-close-btn" onClick={onClose} title="Close feedback">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      
      {isLoading ? (
        <div className="feedback-loading">
          <div className="loading-spinner"></div>
          <p>Generating detailed feedback...</p>
        </div>
      ) : (
        <div className="feedback-content">
          <ReactMarkdown>{feedback}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default BMCFeedbackView;

