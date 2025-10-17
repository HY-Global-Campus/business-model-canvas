import React from 'react';

interface AISuggestionBannerProps {
  suggestion: string | null;
  onDismiss: () => void;
  isLoading: boolean;
}

const AISuggestionBanner: React.FC<AISuggestionBannerProps> = ({ 
  suggestion, 
  onDismiss, 
  isLoading 
}) => {
  if (!suggestion || isLoading) return null;

  return (
    <div className="ai-suggestion-banner">
      <div className="suggestion-content">
        <span className="suggestion-icon">💡</span>
        <p>{suggestion}</p>
      </div>
      <button className="dismiss-button" onClick={onDismiss}>
        ×
      </button>
    </div>
  );
};

export default AISuggestionBanner;

