import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import ChatBot from '../../Components/ChatBot';
import BMCCanvasOverview from '../../Components/BMC/BMCCanvasOverview';
import BMCFeedbackView from '../../Components/BMC/BMCFeedbackView';
import BMCBusinessPlanView from '../../Components/BMC/BMCBusinessPlanView';
import { BMCContext } from '../../contexts/BMCContext';
import { 
  getBMCProjectByUserId, 
  updateBMCProject, 
  calculateBlockCompletion 
} from '../../api/bmcService';
import { getFeedback, getBusinessPlan } from '../../api/chatbotService';
import { BMCProject, BMCBlockId, BusinessContext } from '../../../types/bmc';
import './bmc.css';

type MutationContext = {
  previousData?: BMCProject;
};

const BMCPage: React.FC = () => {
  const queryClient = useQueryClient();
  const userId = sessionStorage.getItem('id');
  const location = useLocation();
  const navigate = useNavigate();
  const { blockId } = useParams<{ blockId?: string }>();
  
  const [currentBlock, setCurrentBlock] = useState<BMCBlockId | null>(
    blockId as BMCBlockId || null
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFetchingFeedback, setIsFetchingFeedback] = useState(false);
  const [businessPlan, setBusinessPlan] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  // On mobile, hide canvas/chatbot by default to prioritize editor
  const [showCanvas, setShowCanvas] = useState(() => window.innerWidth > 640);
  const [showChatbot, setShowChatbot] = useState(() => window.innerWidth > 640);

  // Fetch BMC project data
  const { data: project, isLoading: loading, error } = useQuery<BMCProject, Error>({
    queryKey: ['bmc-project', userId],
    queryFn: () => getBMCProjectByUserId(userId!),
    enabled: !!userId,
  }, queryClient);

  // Mutation for updating project
  const mutation = useMutation<BMCProject, Error, Partial<BMCProject>, MutationContext>({
    mutationFn: async (updatedProject: Partial<BMCProject>) => {
      const currentData = queryClient.getQueryData<BMCProject>(['bmc-project', userId]);
      if (!currentData) {
        throw new Error('Project data is not defined');
      }
      return await updateBMCProject(currentData.id, updatedProject);
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: ['bmc-project', userId],
      });
      const previousData = queryClient.getQueryData<BMCProject>(['bmc-project', userId]);
      queryClient.setQueryData<BMCProject>(['bmc-project', userId], (old) => {
        if (!old) {
          throw new Error('Project is not defined');
        }
        return { ...old, ...newData };
      });
      return { previousData };
    },
    onError: (error, _newData, context) => {
      console.error('Error updating BMC project:', error);
      if (context?.previousData) {
        queryClient.setQueryData<BMCProject>(['bmc-project', userId], context.previousData);
      }
    },
  });

  // Immediate UI update function
  const updateProjectImmediate = useCallback((updateFn: Partial<BMCProject> | ((current: BMCProject) => BMCProject)) => {
    queryClient.setQueryData<BMCProject>(['bmc-project', userId], (old) => {
      if (!old) return old;
      
      if (typeof updateFn === 'function') {
        return updateFn(old);
      } else {
        return { ...old, ...updateFn };
      }
    });
  }, [queryClient, userId]);

  // Debounced server save function
  const debouncedSaveToServer = useRef(
    debounce(() => {
      const currentData = queryClient.getQueryData<BMCProject>(['bmc-project', userId]);
      if (currentData) {
        mutation.mutate(currentData);
      }
    }, 1000)
  ).current;

  // Update a specific block
  const onUpdateBlock = useCallback((blockId: BMCBlockId, content: string) => {
    updateProjectImmediate((current: BMCProject) => {
      const completion = calculateBlockCompletion(content);
      return {
        ...current,
        canvasData: {
          ...current.canvasData,
          [blockId]: content
        },
        lastModified: {
          ...current.lastModified,
          [blockId]: new Date().toISOString()
        },
        completionStatus: {
          ...current.completionStatus,
          [blockId]: completion
        }
      };
    });
    debouncedSaveToServer();
  }, [updateProjectImmediate, debouncedSaveToServer]);

  // Update business context
  const onUpdateBusinessContext = useCallback((context: BusinessContext) => {
    updateProjectImmediate((current: BMCProject) => ({
      ...current,
      businessContext: context
    }));
    debouncedSaveToServer();
  }, [updateProjectImmediate, debouncedSaveToServer]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Toggle canvas visibility
  const toggleCanvas = useCallback(() => {
    setShowCanvas(prev => !prev);
  }, []);

  // Toggle chatbot visibility
  const toggleChatbot = useCallback(() => {
    setShowChatbot(prev => !prev);
  }, []);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Handle feedback request
  const handleRequestFeedback = useCallback(async () => {
    console.log('handleRequestFeedback called', { project: !!project });
    if (!project) {
      console.error('No project available');
      return;
    }
    
    // Navigate to main canvas view if currently editing a block
    if (location.pathname !== '/bmc') {
      navigate('/bmc');
    }
    
    setIsFetchingFeedback(true);
    setFeedback(''); // Set empty to trigger loading state
    setBusinessPlan(null); // Clear business plan if showing
    
    try {
      console.log('Calling getFeedback API...');
      const response = await getFeedback({ canvasData: project });
      console.log('Feedback response received:', response);
      setFeedback(response.feedback);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setFeedback('Failed to generate feedback. Please try again later.');
    } finally {
      setIsFetchingFeedback(false);
    }
  }, [project, location.pathname, navigate]);

  // Handle business plan generation
  const handleGenerateBusinessPlan = useCallback(async () => {
    console.log('handleGenerateBusinessPlan called', { project: !!project });
    if (!project) {
      console.error('No project available');
      return;
    }
    
    // Navigate to main canvas view if currently editing a block
    if (location.pathname !== '/bmc') {
      navigate('/bmc');
    }
    
    setIsGeneratingPlan(true);
    setBusinessPlan(''); // Set empty to trigger loading state
    setFeedback(null); // Clear feedback if showing
    
    try {
      console.log('Calling getBusinessPlan API...');
      const response = await getBusinessPlan({ canvasData: project });
      console.log('Business plan response received:', response);
      setBusinessPlan(response.businessPlan);
    } catch (error) {
      console.error('Error generating business plan:', error);
      setBusinessPlan('Failed to generate business plan. Please try again later.');
    } finally {
      setIsGeneratingPlan(false);
    }
  }, [project, location.pathname, navigate]);

  if (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      sessionStorage.clear();
      return <Navigate to="/login" />;
    }
  }

  const isEditingBlock = location.pathname.includes('/bmc/') && blockId;

  return (
    <>
      <div className={`bmc-page ${isFullscreen ? 'fullscreen' : ''}`}>
        <BMCContext.Provider value={{
          project: project || null,
          loading,
          error: error?.message || null,
          currentBlock,
          readonly: false,
          onUpdateBlock,
          onUpdateBusinessContext,
          setCurrentBlock,
          isFullscreen,
          toggleFullscreen,
          onRequestFeedback: handleRequestFeedback,
          onGenerateBusinessPlan: handleGenerateBusinessPlan,
          showCanvas,
          showChatbot,
          toggleCanvas,
          toggleChatbot
        }}>
          <div className="bmc-layout">
            {/* Toggle buttons for mobile */}
            {!isFullscreen && (
              <>
                <button
                  className="panel-toggle-btn canvas-toggle"
                  onClick={toggleCanvas}
                  title={showCanvas ? 'Hide Canvas' : 'Show Canvas'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    {showCanvas ? (
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    ) : (
                      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                    )}
                  </svg>
                  Canvas
                </button>
                <button
                  className="panel-toggle-btn chatbot-toggle"
                  onClick={toggleChatbot}
                  title={showChatbot ? 'Hide Chatbot' : 'Show Chatbot'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    {showChatbot ? (
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    ) : (
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                    )}
                  </svg>
                  Chat
                </button>
              </>
            )}
            {/* Left panel: Canvas Overview + Chatbot */}
            {!isFullscreen && (
              <div className={`bmc-left-panel ${!showCanvas && !showChatbot ? 'collapsed' : ''}`}>
                {showCanvas && (
                  <div className="bmc-canvas-section">
                    <BMCCanvasOverview />
                  </div>
                )}
                {showChatbot && (
                  <div className="bmc-chatbot-section">
                    <div className="chatbot-header-fixed">
                      <h3>AI Advisor</h3>
                    </div>
                    <div className="chatbot-body-fixed">
                      <ChatBot />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Right panel: Editor/Feedback/BusinessPlan/Welcome */}
            {!isFullscreen && (
              <div className="bmc-editor-panel">
                {isEditingBlock ? (
                  <Outlet />
                ) : businessPlan !== null ? (
                  <BMCBusinessPlanView 
                    businessPlan={businessPlan} 
                    onClose={() => setBusinessPlan(null)} 
                    isLoading={isGeneratingPlan}
                    projectName={project?.displayName}
                  />
                ) : feedback !== null ? (
                  <BMCFeedbackView 
                    feedback={feedback} 
                    onClose={() => setFeedback(null)} 
                    isLoading={isFetchingFeedback}
                  />
                ) : (
                  <BMCWelcome />
                )}
              </div>
            )}
          </div>
        </BMCContext.Provider>
      </div>
    </>
  );
};

// Welcome screen when no block is selected
const BMCWelcome: React.FC = () => {
  return (
    <div className="bmc-welcome">
      <h2>Welcome to Business Model Canvas</h2>
      <p>
        The Business Model Canvas is a strategic management tool that helps you describe, 
        design, challenge, and pivot your business model. It consists of 9 building blocks 
        that cover the four main areas of a business: customers, offer, infrastructure, and 
        financial viability.
      </p>
      <div className="welcome-instructions">
        <h3>Getting Started:</h3>
        <ol>
          <li>Click on any block in the canvas on the left to start editing</li>
          <li>Fill in each section with details about your business</li>
          <li>Use the AI chatbot below to get feedback and suggestions</li>
          <li>Navigate between blocks using the Previous/Next buttons</li>
        </ol>
      </div>
      <div className="welcome-tips">
        <h3>Tips:</h3>
        <ul>
          <li>Start with Customer Segments and Value Propositions - they're the heart of your business</li>
          <li>Review the guidance questions and examples in each block for inspiration</li>
          <li>The chatbot can analyze your canvas and offer suggestions as you work</li>
          <li>Your progress is automatically saved as you type</li>
        </ul>
      </div>
    </div>
  );
};

export default BMCPage;

