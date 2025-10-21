import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { useBMCContext } from '../../contexts/BMCContext';
import { getBlockMeta, getBlockOrder } from '../../../content/bmcBlocks';
import { BMCBlockId } from '../../../types/bmc';
import AIInsights from './AIInsights';
import QuickTipsGutter from './QuickTipsGutter';
import { 
  getGuidance, 
  getConsistencyCheck, 
  getCompetitiveAnalysis, 
  getFinancialCheck,
  getQuickTips 
} from '../../api/chatbotService';
import './editor.css';

const BMCBlockEditor: React.FC = () => {
  const { blockId } = useParams<{ blockId: string }>();
  const navigate = useNavigate();
  const { project, onUpdateBlock, readonly, setCurrentBlock } = useBMCContext();
  
  const [localContent, setLocalContent] = useState('');
  const [showGuidance, setShowGuidance] = useState(true);
  const [showExamples, setShowExamples] = useState(false);

  // AI Insights state
  const [aiInsights, setAiInsights] = useState({
    guidance: '',
    consistency: '',
    competitive: '',
    financial: ''
  });

  const [aiLoading, setAiLoading] = useState({
    guidance: false,
    consistency: false,
    competitive: false,
    financial: false
  });

  const lastFetchTime = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 60000; // 1 minute

  // Quick tips state
  const [quickTips, setQuickTips] = useState<Array<{ tip: string; line: number }>>([]);
  const [quickTipsLoading, setQuickTipsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Debounced fetch for block-specific guidance
  const fetchGuidance = useCallback(
    debounce(async (currentBlockId: string, content: string, canvasData: any) => {
      const now = Date.now();
      if (now - lastFetchTime.current < MIN_FETCH_INTERVAL) return;
      
      setAiLoading(prev => ({ ...prev, guidance: true }));
      try {
        const response = await getGuidance({
          blockId: currentBlockId,
          blockContent: content,
          canvasContext: canvasData
        });
        setAiInsights(prev => ({ ...prev, guidance: response.guidance }));
        lastFetchTime.current = now;
      } catch (error) {
        console.error('Error fetching guidance:', error);
      } finally {
        setAiLoading(prev => ({ ...prev, guidance: false }));
      }
    }, 3000), // 3 second debounce after typing stops
    []
  );

  // Debounced fetch for canvas-wide checks
  const fetchCanvasInsights = useCallback(
    debounce(async (canvasData: any) => {
      const now = Date.now();
      if (now - lastFetchTime.current < MIN_FETCH_INTERVAL) return;
      
      // Fetch all three in parallel
      setAiLoading(prev => ({ 
        ...prev, 
        consistency: true, 
        competitive: true, 
        financial: true 
      }));
      
      try {
        const [consistency, competitive, financial] = await Promise.all([
          getConsistencyCheck({ canvasData }),
          getCompetitiveAnalysis({ canvasData }),
          getFinancialCheck({ canvasData })
        ]);
        
        setAiInsights(prev => ({
          ...prev,
          consistency: consistency.issues,
          competitive: competitive.analysis,
          financial: financial.check
        }));
        lastFetchTime.current = now;
      } catch (error) {
        console.error('Error fetching canvas insights:', error);
      } finally {
        setAiLoading(prev => ({ 
          ...prev, 
          consistency: false, 
          competitive: false, 
          financial: false 
        }));
      }
    }, 3000),
    []
  );

  // Debounced fetch for quick tips (2.5 seconds)
  const fetchQuickTips = useCallback(
    debounce(async (currentBlockId: string, content: string, canvasData: any) => {
      if (!content || content.trim().length < 10) {
        setQuickTips([]);
        return;
      }
      
      setQuickTipsLoading(true);
      try {
        const response = await getQuickTips({
          blockId: currentBlockId,
          blockContent: content,
          canvasContext: canvasData
        });
        setQuickTips(response.tips || []);
      } catch (error) {
        console.error('Error fetching quick tips:', error);
        setQuickTips([]);
      } finally {
        setQuickTipsLoading(false);
      }
    }, 2500), // 2.5 second debounce
    []
  );

  // Trigger fetches when content changes
  useEffect(() => {
    if (!project || !localContent || !blockId) return;
    
    // Fetch guidance for current block
    fetchGuidance(blockId, localContent, project);
    
    // Check if enough content exists for canvas-wide checks
    const totalBlocks = Object.keys(project.canvasData).length;
    const filledBlocks = Object.values(project.canvasData).filter(
      v => v && typeof v === 'string' && v.trim().length > 20
    ).length;
    
    // Only run canvas-wide checks if at least 50% of blocks have content
    if (filledBlocks >= totalBlocks * 0.5) {
      fetchCanvasInsights(project);
    }
  }, [localContent, project, blockId, fetchGuidance, fetchCanvasInsights]);

  // Trigger quick tips fetch separately
  useEffect(() => {
    if (!project || !blockId) {
      setQuickTips([]);
      return;
    }
    
    fetchQuickTips(blockId, localContent, project);
  }, [localContent, project, blockId, fetchQuickTips]);

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

      <div className="editor-content-with-gutter">
        <QuickTipsGutter tips={quickTips} loading={quickTipsLoading} textareaRef={textareaRef} />
        <textarea
          ref={textareaRef}
          className="block-textarea"
          value={localContent}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={meta.placeholder}
          disabled={readonly}
        />
      </div>

      {/* AI Insights */}
      <AIInsights
        guidance={aiInsights.guidance}
        consistency={aiInsights.consistency}
        competitive={aiInsights.competitive}
        financial={aiInsights.financial}
        loading={aiLoading}
      />

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

