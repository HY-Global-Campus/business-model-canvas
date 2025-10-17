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
