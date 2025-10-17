import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBMCContext } from '../../contexts/BMCContext';
import { getBlockMeta, getBlockOrder } from '../../../content/bmcBlocks';
import { BMCBlockId } from '../../../types/bmc';
import './editor.css';

const BMCBlockEditor: React.FC = () => {
  const { blockId } = useParams<{ blockId: string }>();
  const navigate = useNavigate();
  const { project, onUpdateBlock, readonly, setCurrentBlock } = useBMCContext();
  
  const [localContent, setLocalContent] = useState('');
  const [showGuidance, setShowGuidance] = useState(true);
  const [showExamples, setShowExamples] = useState(false);

  const meta = blockId ? getBlockMeta(blockId as BMCBlockId) : null;

  useEffect(() => {
    if (blockId) {
      setCurrentBlock(blockId as BMCBlockId);
    }
    return () => {
      setCurrentBlock(null);
    };
  }, [blockId, setCurrentBlock]);

  useEffect(() => {
    if (project && blockId && meta) {
      const content = project.canvasData[blockId as BMCBlockId] || '';
      setLocalContent(content);
    }
  }, [project, blockId, meta]);

  const handleContentChange = useCallback((newContent: string) => {
    setLocalContent(newContent);
    if (blockId && meta) {
      onUpdateBlock(blockId as BMCBlockId, newContent);
    }
  }, [blockId, meta, onUpdateBlock]);

  const getWordCount = (): number => {
    return localContent.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharCount = (): number => {
    return localContent.length;
  };

  const getCompletion = (): number => {
    if (!project || !blockId) return 0;
    return project.completionStatus[blockId as BMCBlockId] || 0;
  };

  const handleBackToCanvas = () => {
    navigate('/bmc');
  };

  const handlePreviousBlock = () => {
    if (!blockId) return;
    const order = getBlockOrder();
    const currentIndex = order.indexOf(blockId as BMCBlockId);
    if (currentIndex > 0) {
      navigate(`/bmc/${order[currentIndex - 1]}`);
    }
  };

  const handleNextBlock = () => {
    if (!blockId) return;
    const order = getBlockOrder();
    const currentIndex = order.indexOf(blockId as BMCBlockId);
    if (currentIndex < order.length - 1) {
      navigate(`/bmc/${order[currentIndex + 1]}`);
    } else {
      navigate('/bmc');
    }
  };

  const canGoPrevious = () => {
    if (!blockId) return false;
    const order = getBlockOrder();
    return order.indexOf(blockId as BMCBlockId) > 0;
  };

  const canGoNext = () => {
    if (!blockId) return false;
    const order = getBlockOrder();
    const currentIndex = order.indexOf(blockId as BMCBlockId);
    return currentIndex < order.length - 1;
  };

  if (!meta || !project) {
    return (
      <div className="block-editor">
        <div className="editor-error">Block not found</div>
      </div>
    );
  }

  return (
    <div className="block-editor">
      <div className="editor-header">
        <button className="back-button" onClick={handleBackToCanvas}>
          ← Back to Canvas
        </button>
        <div className="editor-title-section">
          <h2 className="editor-title">{meta.title}</h2>
          <div className="editor-stats">
            <span className="stat-item">
              <strong>Words:</strong> {getWordCount()}
            </span>
            <span className="stat-item">
              <strong>Characters:</strong> {getCharCount()}
            </span>
            <span className="stat-item completion">
              <strong>Completion:</strong> {getCompletion()}%
            </span>
          </div>
        </div>
      </div>

      <div className="editor-description">
        <p>{meta.description}</p>
      </div>

      <div className="editor-toggles">
        <button 
          className={`toggle-button ${showGuidance ? 'active' : ''}`}
          onClick={() => setShowGuidance(!showGuidance)}
        >
          {showGuidance ? '✓' : '○'} Guidance Questions
        </button>
        <button 
          className={`toggle-button ${showExamples ? 'active' : ''}`}
          onClick={() => setShowExamples(!showExamples)}
        >
          {showExamples ? '✓' : '○'} Examples
        </button>
      </div>

      {showGuidance && (
        <div className="guidance-panel">
          <h3>Questions to Consider:</h3>
          <ul>
            {meta.guidanceQuestions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      )}

      {showExamples && (
        <div className="examples-panel">
          <h3>Examples:</h3>
          {meta.examples.map((example, index) => (
            <div key={index} className="example-item">
              <p>{example}</p>
            </div>
          ))}
        </div>
      )}

      <div className="editor-content">
        <textarea
          className="block-textarea"
          value={localContent}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={meta.placeholder}
          disabled={readonly}
        />
      </div>

      <div className="editor-navigation">
        <button 
          className="nav-button prev" 
          onClick={handlePreviousBlock}
          disabled={!canGoPrevious()}
        >
          ← Previous Block
        </button>
        <button 
          className="nav-button next" 
          onClick={handleNextBlock}
        >
          {canGoNext() ? 'Next Block →' : 'Back to Canvas →'}
        </button>
      </div>
    </div>
  );
};

export default BMCBlockEditor;

