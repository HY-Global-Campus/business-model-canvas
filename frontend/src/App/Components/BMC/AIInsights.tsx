import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './ai-insights.css';

interface AIInsightsProps {
    guidance?: string;
    consistency?: string;
    competitive?: string;
    financial?: string;
    loading?: {
        guidance?: boolean;
        consistency?: boolean;
        competitive?: boolean;
        financial?: boolean;
    };
}

const AIInsights: React.FC<AIInsightsProps> = ({ 
    guidance, 
    consistency, 
    competitive, 
    financial,
    loading = {}
}) => {
    const [expanded, setExpanded] = useState({
        guidance: true,
        consistency: false,
        competitive: false,
        financial: false
    });

    const toggleSection = (section: keyof typeof expanded) => {
        setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const hasAnyContent = guidance || consistency || competitive || financial;
    const isAnyLoading = Object.values(loading).some(v => v);

    if (!hasAnyContent && !isAnyLoading) return null;

    return (
        <div className="ai-insights">
            <div className="ai-insights-header">
                <span className="ai-icon">✨</span>
                <h4>AI Suggestions</h4>
            </div>

            {/* Block-by-Block Guidance */}
            {(guidance || loading.guidance) && (
                <div className="insight-section">
                    <button 
                        className="insight-toggle"
                        onClick={() => toggleSection('guidance')}
                    >
                        <span className="toggle-icon">{expanded.guidance ? '▼' : '▶'}</span>
                        <span className="insight-label">Tips for this section</span>
                    </button>
                    {expanded.guidance && (
                        <div className="insight-content">
                            {loading.guidance ? (
                                <div className="loading">Analyzing...</div>
                            ) : (
                                <ReactMarkdown>{guidance}</ReactMarkdown>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Consistency Check */}
            {(consistency || loading.consistency) && (
                <div className="insight-section">
                    <button 
                        className="insight-toggle"
                        onClick={() => toggleSection('consistency')}
                    >
                        <span className="toggle-icon">{expanded.consistency ? '▼' : '▶'}</span>
                        <span className="insight-label">Consistency Check</span>
                    </button>
                    {expanded.consistency && (
                        <div className="insight-content">
                            {loading.consistency ? (
                                <div className="loading">Checking...</div>
                            ) : (
                                <ReactMarkdown>{consistency}</ReactMarkdown>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Competitive Analysis */}
            {(competitive || loading.competitive) && (
                <div className="insight-section">
                    <button 
                        className="insight-toggle"
                        onClick={() => toggleSection('competitive')}
                    >
                        <span className="toggle-icon">{expanded.competitive ? '▼' : '▶'}</span>
                        <span className="insight-label">Similar Businesses</span>
                    </button>
                    {expanded.competitive && (
                        <div className="insight-content">
                            {loading.competitive ? (
                                <div className="loading">Researching...</div>
                            ) : (
                                <ReactMarkdown>{competitive}</ReactMarkdown>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Financial Reality Check */}
            {(financial || loading.financial) && (
                <div className="insight-section">
                    <button 
                        className="insight-toggle"
                        onClick={() => toggleSection('financial')}
                    >
                        <span className="toggle-icon">{expanded.financial ? '▼' : '▶'}</span>
                        <span className="insight-label">Financial Check</span>
                    </button>
                    {expanded.financial && (
                        <div className="insight-content">
                            {loading.financial ? (
                                <div className="loading">Analyzing...</div>
                            ) : (
                                <ReactMarkdown>{financial}</ReactMarkdown>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AIInsights;

