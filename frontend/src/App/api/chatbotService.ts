import api from './axiosInstance';

export interface CompletionRequest {
    messages: Message[];
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
