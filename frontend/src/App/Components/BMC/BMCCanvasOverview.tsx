import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBMCContext } from '../../contexts/BMCContext';
import { bmcBlocksMeta, getBlockOrder } from '../../../content/bmcBlocks';
import { BMCBlockId } from '../../../types/bmc';
import './canvas.css';

const BMCCanvasOverview: React.FC = () => {
  const { project, loading } = useBMCContext();
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

  const truncateText = (text: string, maxLength: number = 60): string => {
    if (!text) return 'Click to start...';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bmc-canvas-overview">
      <div className="canvas-header">
        <h2>{project.displayName || 'Business Model Canvas'}</h2>
        {project.businessContext.industry && (
          <p className="business-context">
            {project.businessContext.industry} 
            {project.businessContext.stage && ` • ${project.businessContext.stage}`}
          </p>
        )}
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
                {truncateText(content)}
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

