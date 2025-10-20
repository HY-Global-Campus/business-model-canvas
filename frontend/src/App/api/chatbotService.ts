import api from './axiosInstance';

export interface CompletionRequest {
    messages: Message[];
    canvasContext?: any; // BMC canvas data for context
}

export interface Message {
    role: string;
    content: string;

}

export interface CompletionReponse {
    id: string;
    created: number;
    choices: Choice[];
}

export interface Choice {
    finish_reason: string;
    index: number;
    messages: Message[];
}

export const getCompletion = async (request: CompletionRequest): Promise<CompletionReponse> => {
    const response = await api.post<CompletionReponse>('/chatbot/completion', request);
    return response.data;
}

export interface SuggestionRequest {
    canvasData: any;
    currentBlock: string | null;
    recentChanges: string;
}

export interface SuggestionResponse {
    suggestion: string;
    relevance: 'high' | 'medium' | 'low';
}

export const getSuggestion = async (request: SuggestionRequest): Promise<SuggestionResponse> => {
    const response = await api.post<SuggestionResponse>('/chatbot/suggest', request);
    return response.data;
}

export interface FeedbackRequest {
    canvasData: any;
}

export interface FeedbackResponse {
    feedback: string;
}

export const getFeedback = async (request: FeedbackRequest): Promise<FeedbackResponse> => {
    const response = await api.post<FeedbackResponse>('/chatbot/feedback', request);
    return response.data;
}

export interface GuidanceRequest {
    blockId: string;
    blockContent: string;
    canvasContext: any;
}

export interface GuidanceResponse {
    guidance: string;
}

export interface ConsistencyRequest {
    canvasData: any;
}

export interface ConsistencyResponse {
    issues: string;
}

export interface CompetitiveRequest {
    canvasData: any;
}

export interface CompetitiveResponse {
    analysis: string;
}

export interface FinancialCheckRequest {
    canvasData: any;
}

export interface FinancialCheckResponse {
    check: string;
}

export const getGuidance = async (request: GuidanceRequest): Promise<GuidanceResponse> => {
    const response = await api.post<GuidanceResponse>('/chatbot/guidance', request);
    return response.data;
};

export const getConsistencyCheck = async (request: ConsistencyRequest): Promise<ConsistencyResponse> => {
    const response = await api.post<ConsistencyResponse>('/chatbot/consistency', request);
    return response.data;
};

export const getCompetitiveAnalysis = async (request: CompetitiveRequest): Promise<CompetitiveResponse> => {
    const response = await api.post<CompetitiveResponse>('/chatbot/competitive', request);
    return response.data;
};

export const getFinancialCheck = async (request: FinancialCheckRequest): Promise<FinancialCheckResponse> => {
    const response = await api.post<FinancialCheckResponse>('/chatbot/financial-check', request);
    return response.data;
};

export interface QuickTipsRequest {
    blockId: string;
    blockContent: string;
    canvasContext: any;
}

export interface QuickTipsResponse {
    tips: string[];
}

export const getQuickTips = async (request: QuickTipsRequest): Promise<QuickTipsResponse> => {
    const response = await api.post<QuickTipsResponse>('/chatbot/quick-tips', request);
    return response.data;
};
