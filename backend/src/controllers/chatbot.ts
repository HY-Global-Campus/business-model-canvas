import axios, { AxiosResponse } from "axios";
import express from "express"
import config from "../config.js";

interface CompletionRequest {
    messages: Message[];
    canvasContext?: any; // BMC canvas data for context
}

interface Message {
    role: string;
    content: string;

}

interface CompletionReponse {
    id: string;
    created: number;
    choised: Choice[];
}

interface Choice {
    finish_reason: string;
    index: number;
    messages: Message[];
}



const bmcAdvisorPromptContent: string = `You are an expert Business Model Canvas advisor and strategic business consultant. You help entrepreneurs and business professionals develop, refine, and validate their business models using the Business Model Canvas framework.

Your expertise includes:
• Business strategy and business model design
• Customer development and value proposition design
• Revenue models and pricing strategies
• Market analysis and competitive positioning
• Startup methodologies (Lean Startup, Design Thinking)
• Financial modeling and unit economics

Your approach:
• Ask clarifying questions to deeply understand the business context
• Provide constructive, specific feedback on canvas blocks
• Challenge assumptions and identify potential weaknesses or gaps
• Suggest improvements based on best practices and real-world examples
• Identify dependencies and connections between different canvas blocks
• Offer proactive suggestions when you notice inconsistencies or opportunities

Your tone:
• Professional yet approachable
• Supportive but willing to challenge ideas constructively
• Evidence-based and practical
• Encouraging without being overly positive
• Clear and concise in your communication

When analyzing a Business Model Canvas:
• Consider how well-defined and specific each block is
• Look for alignment between related blocks (e.g., Value Propositions and Customer Segments)
• Identify potential risks or unrealistic assumptions
• Suggest concrete next steps for validation or improvement
• Reference successful business models when relevant as examples

Guidelines:
• Keep responses focused and actionable (aim for 150 words or less unless deep analysis is requested)
• Always relate your feedback back to the specific business context
• If information is vague or generic, ask for more specificity
• Highlight both strengths and areas for improvement
• Suggest validation methods (customer interviews, MVPs, etc.) when appropriate
• Don't make assumptions - ask questions when context is unclear

Current canvas context will be provided when available. Use this context to:
• Understand the overall business model
• Identify gaps or incomplete sections
• Spot inconsistencies between different blocks
• Provide relevant, context-aware suggestions
• Track progress and improvements over time

If the user asks questions unrelated to business model development, gently guide the conversation back to their canvas while being helpful.`;


const bmcAdvisorPrompt: Message = {
    role: 'system',
    content: bmcAdvisorPromptContent,
}

const getCompletion = async (data: CompletionRequest): Promise<CompletionReponse> =>  {
    try {
        // Inject canvas context if provided
        let systemPrompt = bmcAdvisorPromptContent;
        if (data.canvasContext) {
            systemPrompt += `\n\n--- Current Business Model Canvas State ---\n${JSON.stringify(data.canvasContext, null, 2)}\n--- End Canvas State ---\n\nUse this canvas information to provide context-aware feedback and suggestions.`;
        }
        
        const contextualPrompt: Message = {
            role: 'system',
            content: systemPrompt,
        };
        
        data.messages.unshift(contextualPrompt);
        const url = `${config.GCAI_URL}/api/chat`;
        const response: AxiosResponse<CompletionReponse> = await axios.post<CompletionReponse>(url, data, { headers: {
            authorization: `Bearer ${config.GCAI_TOKEN}`,
        }}); 

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error with Axios:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}



const chatbotRouter = express.Router();

chatbotRouter.post('/completion', async (req, res) => {
    const requestData: CompletionRequest = req.body;
    const response = await getCompletion(requestData);
    res.json(response);
});

// Endpoint for unprompted suggestions based on canvas context
chatbotRouter.post('/suggest', async (req, res) => {
    try {
        const { canvasData, currentBlock, recentChanges } = req.body;
        
        // Create a prompt for generating suggestions
        const suggestionPrompt = `Based on the current state of the Business Model Canvas, provide a brief, actionable suggestion to improve the business model. Focus on:
- Identifying gaps or incomplete sections
- Spotting inconsistencies between blocks
- Suggesting next steps for the current block: ${currentBlock || 'overall canvas'}
- Highlighting important dependencies or connections

Recent changes: ${recentChanges || 'User is actively working on the canvas'}

Provide ONE specific, actionable suggestion in 2-3 sentences. Be concise and helpful.`;

        const suggestionRequest: CompletionRequest = {
            messages: [{
                role: 'user',
                content: suggestionPrompt
            }],
            canvasContext: canvasData
        };

        const response = await getCompletion(suggestionRequest);
        const suggestion = response.choices?.[0]?.messages?.[0]?.content || 'Keep working on your canvas!';
        
        // Determine relevance based on canvas completion
        const filledBlocks = Object.values(canvasData?.canvasData || {}).filter((v: any) => v && v.trim().length > 0).length;
        const relevance = filledBlocks < 3 ? 'low' : filledBlocks < 6 ? 'medium' : 'high';
        
        res.json({ suggestion, relevance });
    } catch (error) {
        console.error('Error generating suggestion:', error);
        res.status(500).json({ error: 'Failed to generate suggestion' });
    }
});

export default chatbotRouter
