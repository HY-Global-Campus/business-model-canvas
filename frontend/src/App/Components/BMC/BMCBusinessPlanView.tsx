import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import './business-plan.css';

interface BMCBusinessPlanViewProps {
  businessPlan: string;
  onClose: () => void;
  isLoading?: boolean;
  projectName?: string;
}

const BMCBusinessPlanView: React.FC<BMCBusinessPlanViewProps> = ({ 
  businessPlan, 
  onClose, 
  isLoading,
  projectName 
}) => {
  // Parse the business plan to separate markdown and JSON metadata
  const { markdownContent, metadata } = useMemo(() => {
    if (!businessPlan) {
      return { markdownContent: '', metadata: null };
    }

    // Try to find JSON metadata at the end of the response
    // Look for JSON object that starts with { and contains the expected keys
    const jsonMatch = businessPlan.match(/\{[\s\S]*"assumptions"[\s\S]*"key_risks"[\s\S]*"priority_kpis"[\s\S]*"section_word_counts"[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[0];
        const parsedMetadata = JSON.parse(jsonStr);
        const markdownEnd = businessPlan.lastIndexOf(jsonStr);
        const markdown = businessPlan.substring(0, markdownEnd).trim();
        return { markdownContent: markdown, metadata: parsedMetadata };
      } catch (e) {
        // If JSON parsing fails, return everything as markdown
        return { markdownContent: businessPlan, metadata: null };
      }
    }
    
    return { markdownContent: businessPlan, metadata: null };
  }, [businessPlan]);

  const handleDownload = () => {
    const blob = new Blob([businessPlan], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = `${projectName || 'Business-Plan'}_${new Date().toISOString().split('T')[0]}.md`;
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="business-plan-view">
      <div className="business-plan-header">
        <div className="business-plan-title-section">
          <h2>Business Plan</h2>
        </div>
        <div className="business-plan-actions">
          <button 
            className="business-plan-download-btn" 
            onClick={handleDownload}
            title="Download as Markdown"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
            </svg>
          </button>
          <button 
            className="business-plan-close-btn" 
            onClick={onClose} 
            title="Close business plan"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="business-plan-loading">
          <div className="loading-spinner"></div>
          <p>Generating business plan...</p>
        </div>
      ) : (
        <div className="business-plan-content">
          <div className="business-plan-markdown">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
          
          {metadata && (
            <div className="business-plan-metadata">
              <h3>Metadata</h3>
              {metadata.assumptions && metadata.assumptions.length > 0 && (
                <div className="metadata-section">
                  <h4>Assumptions</h4>
                  <ul>
                    {metadata.assumptions.map((assumption: string, index: number) => (
                      <li key={index}>{assumption}</li>
                    ))}
                  </ul>
                </div>
              )}
              {metadata.key_risks && metadata.key_risks.length > 0 && (
                <div className="metadata-section">
                  <h4>Key Risks</h4>
                  <ul>
                    {metadata.key_risks.map((risk: string, index: number) => (
                      <li key={index}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}
              {metadata.priority_kpis && metadata.priority_kpis.length > 0 && (
                <div className="metadata-section">
                  <h4>Priority KPIs</h4>
                  <ul>
                    {metadata.priority_kpis.map((kpi: string, index: number) => (
                      <li key={index}>{kpi}</li>
                    ))}
                  </ul>
                </div>
              )}
              {metadata.section_word_counts && (
                <div className="metadata-section">
                  <h4>Section Word Counts</h4>
                  <table className="word-count-table">
                    <thead>
                      <tr>
                        <th>Section</th>
                        <th>Words</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(metadata.section_word_counts).map(([section, count]) => (
                        <tr key={section}>
                          <td>{section}</td>
                          <td>{count as number}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BMCBusinessPlanView;

