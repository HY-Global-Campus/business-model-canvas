import api from './axiosInstance';
import { BMCProject, BMCBlockId, BMCExercises, BusinessContext } from '../../types/bmc';

// Get BMC project by user ID
export const getBMCProjectByUserId = async (userId: string): Promise<BMCProject> => {
  const response = await api.get<BMCProject>(`/course/user/${userId}`);
  return response.data;
};

// Update BMC project
export const updateBMCProject = async (
  projectId: number,
  updates: Partial<BMCProject>
): Promise<BMCProject> => {
  const response = await api.put<BMCProject>(`/course/${projectId}`, updates);
  return response.data;
};

// Update a specific canvas block
export const updateCanvasBlock = async (
  projectId: number,
  blockId: BMCBlockId,
  content: string
): Promise<BMCProject> => {
  const updates = {
    canvasData: {
      [blockId]: content
    },
    lastModified: {
      [blockId]: new Date().toISOString()
    }
  };
  return updateBMCProject(projectId, updates);
};

// Update business context
export const updateBusinessContext = async (
  projectId: number,
  context: BusinessContext
): Promise<BMCProject> => {
  return updateBMCProject(projectId, { businessContext: context });
};

// Calculate completion status for a block
export const calculateBlockCompletion = (content: string | undefined): number => {
  if (!content) return 0;
  const wordCount = content.trim().split(/\s+/).length;
  if (wordCount === 0) return 0;
  if (wordCount < 20) return 25;
  if (wordCount < 50) return 50;
  if (wordCount < 100) return 75;
  return 100;
};

// Update completion status for a block
export const updateBlockCompletion = async (
  projectId: number,
  blockId: BMCBlockId,
  completionPercentage: number
): Promise<BMCProject> => {
  return updateBMCProject(projectId, {
    completionStatus: {
      [blockId]: completionPercentage
    }
  });
};

// Get overall canvas completion
export const getOverallCompletion = (project: BMCProject): number => {
  const blocks: BMCBlockId[] = [
    'customerSegments',
    'valuePropositions',
    'channels',
    'customerRelationships',
    'revenueStreams',
    'keyResources',
    'keyActivities',
    'keyPartnerships',
    'costStructure'
  ];
  
  const totalCompletion = blocks.reduce((sum, blockId) => {
    return sum + (project.completionStatus[blockId] || 0);
  }, 0);
  
  return Math.round(totalCompletion / blocks.length);
};

export type { BMCProject, BMCBlockId, BMCExercises, BusinessContext };

