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

// Endpoint for detailed instructor-style feedback on the complete canvas
chatbotRouter.post('/feedback', async (req, res) => {
    try {
        const { canvasData } = req.body;
        
        const instructorPrompt = `[Role/Context]: You are an instructor providing feedback on a student's Business Model Canvas assignment for a university-level course. The student may not be a business major but has an academic background, so they can understand nuanced feedback.

[Task]: Read the student's Business Model Canvas and give clear, constructive feedback on its content. Focus on the substantive quality of their ideas and analysis in each section of the canvas (Value Proposition, Customer Segments, Channels, Revenue Streams, Cost Structure, etc.), rather than on writing style or formatting.

[Feedback Requirements]: In your feedback, include the following elements:

Positives: Begin by highlighting what the student did well. Identify specific strengths in their canvas – for example, strong points in their reasoning, creative ideas, well-supported assumptions, or sections that are especially clear or thorough. Be genuine and specific, so the student knows exactly what was effective about their work. (E.g., "The Customer Segments section is very clear and focused – you've clearly identified who your target users are and provided a rationale for why they would value the product. Great job on backing that up with market research data.")

Areas for Improvement: After discussing the strengths, point out the main areas where the canvas could be improved. Choose the most important issues that will help the student progress. Describe each issue clearly and objectively, and explain why it's a problem or could be better. Crucially, offer constructive suggestions or questions to guide improvement. (E.g., "The Value Proposition could be more specific. Currently it says 'improves efficiency for businesses' – consider explaining how it improves efficiency, perhaps by mentioning a measurable outcome or a comparison to current solutions. This would make your value proposition more convincing.") Maintain a helpful, encouraging tone here – the aim is to coach the student on how to get better, not to discourage them.

Content Focus: Keep your comments centered on the content and ideas. If there are minor writing errors, you can note them briefly only if they significantly affect understanding, but do not fixate on grammar or spelling. For example, you might note "There were a few typos, but they didn't hinder understanding." The primary goal is to critique the business model elements: Are they logical? feasible? well-integrated? original? Provide feedback on those aspects.

Tone and Style: Write in a respectful, supportive tone. Imagine you are coaching the student – your language should be clear, empathetic, and motivating. Avoid using harsh or dismissive language. Even when pointing out weaknesses, phrase them as areas for growth or questions to consider. For instance, instead of "This part is unclear and poorly done," you could say "This part was a bit unclear to me – perhaps you could clarify X...". Acknowledge the effort the student put into the canvas (e.g., "I can see you put thought into outlining the key partners, which is great...") and show that your criticisms are meant to help them improve further.

Conciseness: Make sure your feedback is well-organized and not overly long. You might write a short paragraph (2-4 sentences) about the positives, and another short paragraph about each major area for improvement. Use bullet points for separate suggestions if that makes it clearer. The student should be able to read your feedback quickly and grasp the main points. Every comment should have a purpose (either praise or a suggestion).

Grade (0–5): After your comments, give an estimated grade from 0 to 5 for the overall quality of the Business Model Canvas. Use 5 for excellent work, 4 for very good, 3 for fair/average, 2 for poor, 1 or 0 for very poor or missing work. Importantly, accompany the grade with a one-sentence justification that ties it to the feedback. For example: "Overall Grade: 3/5. I've given a 3 because while the canvas covers all sections and has a solid Customer Segments and Channels, the Value Proposition and Revenue model lack detail and evidence, as noted above. Strengthening those areas would likely raise this to a 4 or 5." This helps the student understand how their work translates into a grade and what would be needed to improve that grade.

[End of Feedback]: Conclude your feedback on a positive and encouraging note. You might encourage the student to implement the suggestions and express confidence in their ability to improve. For instance, "I hope these comments help you refine your business model. I'm confident that with some revisions – especially clarifying the value proposition and adding detail to the financials – you can elevate this canvas to a higher level. Good luck!"

Your response will thus consist of: a brief opening praise, a detailed but focused critique with suggestions, an overall grade 0–5 with reasoning, and a closing note of encouragement.`;
        
        const feedbackRequest: CompletionRequest = {
            messages: [{
                role: 'user',
                content: instructorPrompt
            }],
            canvasContext: canvasData
        };

        const response = await getCompletion(feedbackRequest);
        const feedback = response.choices?.[0]?.messages?.[0]?.content || 'Unable to generate feedback at this time. Please try again later.';
        
        res.json({ feedback });
    } catch (error) {
        console.error('Error generating feedback:', error);
        res.status(500).json({ error: 'Failed to generate feedback' });
    }
});

// Block-by-block AI guidance endpoint
chatbotRouter.post('/guidance', async (req, res) => {
    try {
        const { blockId, blockContent, canvasContext } = req.body;
        
        const guidancePrompt = `You are an AI teaching assistant helping a student complete their Business Model Canvas.

Current Block: ${blockId}
Student's Content: ${blockContent || '(empty)'}

Provide 2-3 specific, actionable tips to improve this block:
- Ask probing questions to deepen thinking
- Suggest specific elements they might be missing
- Connect to other blocks if relevant
- Keep it brief and encouraging (3-4 sentences max)

Format as a short paragraph, not a list.`;
        
        const request: CompletionRequest = {
            messages: [{ role: 'user', content: guidancePrompt }],
            canvasContext: canvasContext
        };

        const response = await getCompletion(request);
        const guidance = response.choices?.[0]?.messages?.[0]?.content || '';
        
        res.json({ guidance });
    } catch (error) {
        console.error('Error generating guidance:', error);
        res.status(500).json({ error: 'Failed to generate guidance' });
    }
});

// Consistency check endpoint
chatbotRouter.post('/consistency', async (req, res) => {
    try {
        const { canvasData } = req.body;
        
        const consistencyPrompt = `Analyze this Business Model Canvas for logical consistency between blocks.

Check for:
- Value Proposition matches Customer Segments
- Channels align with Customer Segments
- Revenue Streams match Value Proposition and Customer Relationships
- Key Activities/Resources support Value Proposition
- Cost Structure aligns with Key Activities/Resources/Partners

Identify 1-3 most important inconsistencies or gaps. For each:
- State the issue clearly
- Explain why it matters
- Suggest a fix

Be specific and constructive. If everything looks good, say so and offer one optimization tip.

Keep response under 200 words total.`;
        
        const request: CompletionRequest = {
            messages: [{ role: 'user', content: consistencyPrompt }],
            canvasContext: canvasData
        };

        const response = await getCompletion(request);
        const issues = response.choices?.[0]?.messages?.[0]?.content || '';
        
        res.json({ issues });
    } catch (error) {
        console.error('Error checking consistency:', error);
        res.status(500).json({ error: 'Failed to check consistency' });
    }
});

// Competitive analysis endpoint
chatbotRouter.post('/competitive', async (req, res) => {
    try {
        const { canvasData } = req.body;
        
        const competitivePrompt = `Based on this Business Model Canvas, suggest 1-2 real-world companies or business models that are similar.

For each example:
- Name the company/model
- Explain the similarity (1 sentence)
- Highlight one key learning point or difference

Be specific and relevant. Keep total response under 150 words.`;
        
        const request: CompletionRequest = {
            messages: [{ role: 'user', content: competitivePrompt }],
            canvasContext: canvasData
        };

        const response = await getCompletion(request);
        const analysis = response.choices?.[0]?.messages?.[0]?.content || '';
        
        res.json({ analysis });
    } catch (error) {
        console.error('Error generating competitive analysis:', error);
        res.status(500).json({ error: 'Failed to generate analysis' });
    }
});

// Financial reality check endpoint
chatbotRouter.post('/financial-check', async (req, res) => {
    try {
        const { canvasData } = req.body;
        
        const financialPrompt = `Review the Revenue Streams and Cost Structure in this Business Model Canvas.

Provide a quick financial reality check:
- Are the revenue streams realistic for this business type?
- Are major cost categories missing?
- Does the business model seem financially viable?
- Any red flags or optimization opportunities?

Give 2-3 specific, actionable observations. Keep under 150 words.`;
        
        const request: CompletionRequest = {
            messages: [{ role: 'user', content: financialPrompt }],
            canvasContext: canvasData
        };

        const response = await getCompletion(request);
        const check = response.choices?.[0]?.messages?.[0]?.content || '';
        
        res.json({ check });
    } catch (error) {
        console.error('Error performing financial check:', error);
        res.status(500).json({ error: 'Failed to perform financial check' });
    }
});

// Quick tips endpoint for inline gutter suggestions
chatbotRouter.post('/quick-tips', async (req, res) => {
    try {
        const { blockId, blockContent, canvasContext } = req.body;
        
        const quickTipsPrompt = `You are an AI teaching assistant analyzing a Business Model Canvas block.

Current Block: ${blockId}
Student's Content: ${blockContent || '(empty)'}

Provide 2-4 SHORT, ACTIONABLE quick tips (each max 8 words).

Rules:
1. Each tip must be actionable or point out a specific gap
2. Use these formats:
   - "Add [specific thing]" (e.g., "Add specific pricing numbers")
   - "Name [specific examples]" (e.g., "Name 2-3 target industries")
   - "⚠️ Missing [important element]" (e.g., "⚠️ Missing customer pain points")
   - "Consider [specific aspect]" (e.g., "Consider mobile vs desktop")
3. NO generic praise or filler ("Good start", "Keep going", etc.)
4. Focus on what's MISSING or needs MORE DETAIL
5. Return ONLY if there are actual improvements needed

IMPORTANT: Return ONLY a valid JSON array, with NO markdown formatting, NO code blocks, NO explanation.
Just the raw JSON array: ["tip1", "tip2", "tip3"]

If content is already excellent with nothing to add, return: []`;
        
        const request: CompletionRequest = {
            messages: [{ role: 'user', content: quickTipsPrompt }],
            canvasContext: canvasContext
        };

        const response = await getCompletion(request);
        let content = response.choices?.[0]?.messages?.[0]?.content || '[]';
        
        // Clean up markdown code blocks if present
        content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        
        // Parse JSON response
        let tips: string[] = [];
        try {
            tips = JSON.parse(content);
            // Ensure it's an array of strings
            if (!Array.isArray(tips)) {
                tips = [];
            }
            // Filter out empty strings and limit to 4 tips
            tips = tips.filter(tip => tip && typeof tip === 'string' && tip.trim().length > 0).slice(0, 4);
        } catch (e) {
            // If AI didn't return valid JSON, try to extract tips from text
            // Look for quoted strings or bullet points
            const lines = content.split('\n').filter(line => line.trim().length > 0);
            tips = lines
                .map(line => {
                    // Remove bullets, dashes, numbers, quotes
                    return line.replace(/^[\-\*\d\.\)\]]\s*/, '').replace(/^["']|["']$/g, '').trim();
                })
                .filter(line => line.length > 0 && line.length < 100) // Reasonable length for a tip
                .slice(0, 4);
        }
        
        res.json({ tips });
    } catch (error) {
        console.error('Error generating quick tips:', error);
        res.status(500).json({ error: 'Failed to generate quick tips' });
    }
});

export default chatbotRouter
