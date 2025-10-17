import { useState, useEffect, useRef } from 'react';
import { BMCProject, BMCBlockId } from '../../types/bmc';
import { getSuggestion, SuggestionResponse } from '../api/chatbotService';

interface UseAISuggestionsProps {
  project: BMCProject | null;
  currentBlock: BMCBlockId | null;
  enabled?: boolean;
}

interface UseAISuggestionsReturn {
  suggestion: SuggestionResponse | null;
  isLoading: boolean;
  error: string | null;
  triggerSuggestion: () => void;
  dismissSuggestion: () => void;
}

export const useAISuggestions = ({
  project,
  currentBlock,
  enabled = true
}: UseAISuggestionsProps): UseAISuggestionsReturn => {
  const [suggestion, setSuggestion] = useState<SuggestionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const lastSuggestionTime = useRef<number>(0);
  const lastCanvasState = useRef<string>('');
  const suggestionTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestion = async () => {
    if (!project || !enabled) return;

    // Check if canvas has any content
    const hasContent = Object.values(project.canvasData).some(content => {
      return content && typeof content === 'string' && content.trim().length > 0;
    });
    
    if (!hasContent) {
      return; // No content yet, skip suggestion
    }

    // Don't fetch suggestions too frequently (minimum 30 seconds between suggestions)
    const now = Date.now();
    if (now - lastSuggestionTime.current < 30000) {
      return;
    }

    // Check if canvas has changed since last suggestion
    const currentCanvasState = JSON.stringify(project.canvasData);
    if (currentCanvasState === lastCanvasState.current) {
      return; // No changes since last suggestion, skip
    }

    try {
      setIsLoading(true);
      setError(null);

      const recentChanges = currentBlock 
        ? `User is currently working on: ${currentBlock}`
        : 'User is viewing the canvas overview';

      const response = await getSuggestion({
        canvasData: project,
        currentBlock: currentBlock,
        recentChanges
      });

      setSuggestion(response);
      lastSuggestionTime.current = now;
      lastCanvasState.current = currentCanvasState;
    } catch (err) {
      console.error('Failed to fetch AI suggestion:', err);
      setError('Failed to generate suggestion');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerSuggestion = () => {
    // Allow manual trigger
    lastSuggestionTime.current = 0; // Reset cooldown
    fetchSuggestion();
  };

  const dismissSuggestion = () => {
    setSuggestion(null);
  };

  // Set up periodic suggestion trigger (every 60 seconds when data changes)
  useEffect(() => {
    if (!enabled || !project) return;

    // Check if there's any content
    const hasContent = Object.values(project.canvasData).some(content => {
      return content && typeof content === 'string' && content.trim().length > 0;
    });
    
    if (!hasContent) return; // No content, don't set timer

    // Check if data has changed since last suggestion
    const currentCanvasState = JSON.stringify(project.canvasData);
    if (currentCanvasState === lastCanvasState.current) {
      return; // No changes, don't reset timer
    }

    // Clear existing timer
    if (suggestionTimer.current) {
      clearTimeout(suggestionTimer.current);
    }

    // Set new timer for 60 seconds after data change
    suggestionTimer.current = setTimeout(() => {
      fetchSuggestion();
    }, 60000);

    return () => {
      if (suggestionTimer.current) {
        clearTimeout(suggestionTimer.current);
      }
    };
  }, [project?.canvasData, enabled]);

  // Trigger suggestion when block changes (after a delay)
  useEffect(() => {
    if (!currentBlock || !project || !enabled) return;

    // Check if the current block has content
    const blockContent = project.canvasData[currentBlock];
    if (!blockContent || blockContent.trim().length === 0) {
      return; // Block is empty, don't trigger suggestion
    }

    const blockChangeTimer = setTimeout(() => {
      fetchSuggestion();
    }, 10000); // Wait 10 seconds after block change

    return () => {
      clearTimeout(blockChangeTimer);
    };
  }, [currentBlock]);

  return {
    suggestion,
    isLoading,
    error,
    triggerSuggestion,
    dismissSuggestion
  };
};

