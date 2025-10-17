import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import ChatBot from '../../Components/ChatBot';
import BMCCanvasOverview from '../../Components/BMC/BMCCanvasOverview';
import { BMCContext } from '../../contexts/BMCContext';
import { 
  getBMCProjectByUserId, 
  updateBMCProject, 
  calculateBlockCompletion 
} from '../../api/bmcService';
import { BMCProject, BMCBlockId, BusinessContext } from '../../../types/bmc';
import './bmc.css';

type MutationContext = {
  previousData?: BMCProject;
};

const BMCPage: React.FC = () => {
  const queryClient = useQueryClient();
  const userId = sessionStorage.getItem('id');
  const location = useLocation();
  const { blockId } = useParams<{ blockId?: string }>();
  
  const [currentBlock, setCurrentBlock] = useState<BMCBlockId | null>(
    blockId as BMCBlockId || null
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

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
          toggleFullscreen
        }}>
          <div className="bmc-layout">
            {/* Left panel: Canvas Overview + Chatbot */}
            <div className="bmc-left-panel">
              <div className="bmc-canvas-section">
                <BMCCanvasOverview />
              </div>
              {!isFullscreen && (
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

            {/* Right panel: Editor only */}
            {!isFullscreen && (
              <div className="bmc-editor-panel">
                {isEditingBlock ? (
                  <Outlet />
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

