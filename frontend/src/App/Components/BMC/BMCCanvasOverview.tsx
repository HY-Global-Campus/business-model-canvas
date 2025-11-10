import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { useBMCContext } from '../../contexts/BMCContext';
import { bmcBlocksMeta, getBlockOrder } from '../../../content/bmcBlocks';
import { BMCBlockId } from '../../../types/bmc';
import { exportToPowerPoint, exportToPDF, exportToODP } from '../../utils/exportUtils';
import './canvas.css';

const BMCCanvasOverview: React.FC = () => {
  const { project, loading, isFullscreen, toggleFullscreen, onRequestFeedback, onGenerateBusinessPlan } = useBMCContext();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPowerPoint, setIsExportingPowerPoint] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingODP, setIsExportingODP] = useState(false);
  const [isRequestingFeedback, setIsRequestingFeedback] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  if (loading || !project) {
    return <div className="canvas-loading">Loading canvas...</div>;
  }

  const handleBlockClick = (blockId: BMCBlockId) => {
    navigate(`/bmc/${blockId}`);
  };

  const handleRequestFeedback = async () => {
    if (!project || !onRequestFeedback) {
      console.log('Cannot request feedback:', { project: !!project, onRequestFeedback: !!onRequestFeedback });
      return;
    }
    
    // Check if canvas has any content
    const hasContent = Object.values(project.canvasData).some(content => {
      return content && typeof content === 'string' && content.trim().length > 0;
    });
    
    if (!hasContent) {
      alert('Please add some content to your canvas before requesting feedback.');
      return;
    }
    
    console.log('Requesting feedback...');
    setIsRequestingFeedback(true);
    try {
      await onRequestFeedback();
      console.log('Feedback received');
    } catch (error) {
      console.error('Error requesting feedback:', error);
      alert('Failed to request feedback. Please try again.');
    } finally {
      setIsRequestingFeedback(false);
    }
  };

  const handleGenerateBusinessPlan = async () => {
    if (!project || !onGenerateBusinessPlan) {
      console.log('Cannot generate business plan:', { project: !!project, onGenerateBusinessPlan: !!onGenerateBusinessPlan });
      return;
    }
    
    // Check if canvas has any content
    const hasContent = Object.values(project.canvasData).some(content => {
      return content && typeof content === 'string' && content.trim().length > 0;
    });
    
    if (!hasContent) {
      alert('Please add some content to your canvas before generating a business plan.');
      return;
    }
    
    console.log('Generating business plan...');
    setIsGeneratingPlan(true);
    try {
      await onGenerateBusinessPlan();
      console.log('Business plan generated');
    } catch (error) {
      console.error('Error generating business plan:', error);
      alert('Failed to generate business plan. Please try again.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleExport = async () => {
    if (!canvasRef.current || !toggleFullscreen) return;
    
    setIsExporting(true);
    const wasFullscreen = isFullscreen;
    
    try {
      // Enter fullscreen mode temporarily (but keep it hidden)
      if (!wasFullscreen) {
        toggleFullscreen();
        // Wait for layout to update
        await new Promise(resolve => setTimeout(resolve, 400));
      }
      
      // Create an overlay to hide the visual change
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.backgroundColor = wasFullscreen ? 'transparent' : 'rgba(255, 255, 255, 0.95)';
      overlay.style.zIndex = '9998';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.fontSize = '18px';
      overlay.style.fontFamily = 'Gotham Narrow, Arial, sans-serif';
      overlay.innerHTML = wasFullscreen ? '' : 'Exporting canvas...';
      
      if (!wasFullscreen) {
        document.body.appendChild(overlay);
      }
      
      // Hide completion badges and click hints for export
      const completionBadges = canvasRef.current.querySelectorAll('.completion-badge');
      const clickHints = canvasRef.current.querySelectorAll('.click-hint');
      const blockFooters = canvasRef.current.querySelectorAll('.block-footer');
      
      const hiddenElements: HTMLElement[] = [];
      completionBadges.forEach(el => {
        hiddenElements.push(el as HTMLElement);
        (el as HTMLElement).style.display = 'none';
      });
      clickHints.forEach(el => {
        hiddenElements.push(el as HTMLElement);
        (el as HTMLElement).style.display = 'none';
      });
      blockFooters.forEach(el => {
        hiddenElements.push(el as HTMLElement);
        (el as HTMLElement).style.display = 'none';
      });
      
      // Wait for layout update
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Capture the canvas
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        backgroundColor: '#f8f9fa',
        logging: false,
        useCORS: true,
      });
      
      // Restore hidden elements
      hiddenElements.forEach(el => {
        el.style.display = '';
      });
      
      // Remove overlay
      if (!wasFullscreen && overlay.parentNode) {
        document.body.removeChild(overlay);
      }
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const fileName = `${project.displayName || 'Business-Model-Canvas'}_${new Date().toISOString().split('T')[0]}.png`;
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
      
      // Restore previous state
      if (!wasFullscreen) {
        await new Promise(resolve => setTimeout(resolve, 100));
        toggleFullscreen();
      }
    } catch (error) {
      console.error('Error exporting canvas:', error);
      alert('Failed to export canvas. Please try again.');
      // Restore state on error
      if (!wasFullscreen && isFullscreen) {
        toggleFullscreen();
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPowerPoint = async () => {
    if (!canvasRef.current || !project) return;
    
    setIsExportingPowerPoint(true);
    try {
      await exportToPowerPoint(project, canvasRef.current, toggleFullscreen, isFullscreen);
    } catch (error) {
      console.error('Error exporting to PowerPoint:', error);
      alert('Failed to export to PowerPoint. Please try again.');
    } finally {
      setIsExportingPowerPoint(false);
    }
  };

  const handleExportPDF = async () => {
    if (!canvasRef.current || !project) return;
    
    setIsExportingPDF(true);
    try {
      await exportToPDF(project, canvasRef.current, toggleFullscreen, isFullscreen);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export to PDF. Please try again.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportODP = async () => {
    if (!canvasRef.current || !project) return;
    
    setIsExportingODP(true);
    try {
      await exportToODP(project, canvasRef.current, toggleFullscreen, isFullscreen);
    } catch (error) {
      console.error('Error exporting to ODP:', error);
      alert('Failed to export to ODP. Please try again.');
    } finally {
      setIsExportingODP(false);
    }
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
          <div className="canvas-actions">
            <button 
              className="canvas-action-btn"
              onClick={handleRequestFeedback}
              disabled={isRequestingFeedback}
              title="Get detailed feedback"
            >
              {isRequestingFeedback ? (
                // Loading spinner
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" strokeDasharray="32" strokeLinecap="round" />
                </svg>
              ) : (
                // Feedback/grade icon
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6zm2-7h8v2H8v-2zm0 4h8v2H8v-2zm0-8h5v2H8V9z"/>
                </svg>
              )}
            </button>
            <button 
              className="canvas-action-btn"
              onClick={handleGenerateBusinessPlan}
              disabled={isGeneratingPlan}
              title="Generate business plan"
            >
              {isGeneratingPlan ? (
                // Loading spinner
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" strokeDasharray="32" strokeLinecap="round" />
                </svg>
              ) : (
                // Business plan/document icon
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                  <path d="M8 10h8v2H8zm0 4h8v2H8zm0 4h5v2H8z"/>
                </svg>
              )}
            </button>
            <button 
              className="canvas-action-btn"
              onClick={handleExport}
              disabled={isExporting}
              title="Export as image (PNG)"
            >
              {isExporting ? (
                // Loading spinner
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" strokeDasharray="32" strokeLinecap="round" />
                </svg>
              ) : (
                // Image icon
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              )}
            </button>
            <button 
              className="canvas-action-btn"
              onClick={handleExportPowerPoint}
              disabled={isExportingPowerPoint}
              title="Export as PowerPoint (.pptx)"
            >
              {isExportingPowerPoint ? (
                // Loading spinner
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" strokeDasharray="32" strokeLinecap="round" />
                </svg>
              ) : (
                // Presentation icon
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9 8h2v8H9zm4 0h2v8h-2z"/>
                </svg>
              )}
            </button>
            <button 
              className="canvas-action-btn"
              onClick={handleExportODP}
              disabled={isExportingODP}
              title="Export as ODF Presentation (.odp)"
            >
              {isExportingODP ? (
                // Loading spinner
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" strokeDasharray="32" strokeLinecap="round" />
                </svg>
              ) : (
                // Slides icon (similar to presentation but slightly different)
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M2 6h4v14H2V6zm6 0h4v14H8V6zm6 0h4v14h-4V6zm6-4v20h2V2h-2z"/>
                </svg>
              )}
            </button>
            <button 
              className="canvas-action-btn"
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              title="Export as PDF"
            >
              {isExportingPDF ? (
                // Loading spinner
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" strokeDasharray="32" strokeLinecap="round" />
                </svg>
              ) : (
                // PDF/Document icon
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
              )}
            </button>
            <button 
              className="canvas-action-btn"
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
      </div>
      
      <div className="canvas-grid" ref={canvasRef}>
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

