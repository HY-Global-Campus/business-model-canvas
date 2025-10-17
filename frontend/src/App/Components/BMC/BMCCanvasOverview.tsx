import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBMCContext } from '../../contexts/BMCContext';
import { bmcBlocksMeta, getBlockOrder } from '../../../content/bmcBlocks';
import { BMCBlockId } from '../../../types/bmc';
import './canvas.css';

const BMCCanvasOverview: React.FC = () => {
  const { project, loading, isFullscreen, toggleFullscreen } = useBMCContext();
  const navigate = useNavigate();

  if (loading || !project) {
    return <div className="canvas-loading">Loading canvas...</div>;
  }

  const handleBlockClick = (blockId: BMCBlockId) => {
    navigate(`/bmc/${blockId}`);
  };

  const getBlockContent = (blockId: BMCBlockId): string => {
    return project.canvasData[blockId] || '';
  };

  const getBlockCompletion = (blockId: BMCBlockId): number => {
    return project.completionStatus[blockId] || 0;
  };

  const getCompletionClass = (completion: number): string => {
    if (completion === 0) return 'empty';
    if (completion < 50) return 'started';
    if (completion < 100) return 'in-progress';
    return 'complete';
  };

  return (
    <div className="bmc-canvas-overview">
      <div className="canvas-header">
        <div className="canvas-header-content">
          <div>
            <h2>{project.displayName || 'Business Model Canvas'}</h2>
            {project.businessContext.industry && (
              <p className="business-context">
                {project.businessContext.industry} 
                {project.businessContext.stage && ` • ${project.businessContext.stage}`}
              </p>
            )}
          </div>
          <button 
            className="fullscreen-toggle-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen (ESC)' : 'View fullscreen'}
          >
            {isFullscreen ? (
              // Exit fullscreen icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
              </svg>
            ) : (
              // Enter fullscreen icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <div className="canvas-grid">
        {getBlockOrder().map((blockId) => {
          const meta = bmcBlocksMeta.find(b => b.id === blockId);
          if (!meta) return null;

          const content = getBlockContent(blockId);
          const completion = getBlockCompletion(blockId);
          const completionClass = getCompletionClass(completion);

          return (
            <div
              key={blockId}
              className={`canvas-block ${completionClass}`}
              style={{ 
                gridArea: meta.gridArea,
                backgroundColor: meta.color,
                borderColor: completionClass === 'complete' ? '#2ecc71' : 
                            completionClass === 'in-progress' ? '#f39c12' : 
                            completionClass === 'started' ? '#e67e22' : '#95a5a6'
              }}
              onClick={() => handleBlockClick(blockId)}
            >
              <div className="block-header">
                <h3 className="block-title">{meta.title}</h3>
                <div className="completion-badge">
                  {completion}%
                </div>
              </div>
              <div className="block-preview">
                {content || 'Click to start...'}
              </div>
              <div className="block-footer">
                <span className="click-hint">Click to edit →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BMCCanvasOverview;

