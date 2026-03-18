export type BMCBlockId = 
  | 'customerSegments' 
  | 'valuePropositions' 
  | 'channels'
  | 'customerRelationships'
  | 'revenueStreams'
  | 'keyResources'
  | 'keyActivities'
  | 'keyPartnerships'
  | 'costStructure';

export interface BusinessContext {
  industry: string;
  stage: string;
  description: string;
}

export interface BMCExercises {
  customerSegments?: string;
  valuePropositions?: string;
  channels?: string;
  customerRelationships?: string;
  revenueStreams?: string;
  keyResources?: string;
  keyActivities?: string;
  keyPartnerships?: string;
  costStructure?: string;
}

export interface BMCProject {
  id: number;
  userId: string;
  displayName: string;
  businessContext: BusinessContext;
  canvasData: BMCExercises;
  lastModified: Record<string, string>;
  completionStatus: Record<string, number>;
}

export interface BMCBlockMeta {
  id: BMCBlockId;
  title: string;
  description: string;
  placeholder: string;
  guidanceQuestions: string[];
  examples: string[];
  gridArea: string; // CSS grid area name
  color: string; // Block color
}

