import api from './api';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface CopilotResponse {
    message: string;
    metrics: {
        health_score: number;
        survival_probability: number;
    } | null;
    warnings: string[];
    recommendations: string[];
}

export const sendCopilotMessage = async (
    question: string, 
    history: ChatMessage[]
): Promise<CopilotResponse> => {
    
    // Map the continuous chat array into user-assistant pairs for the backend
    const formattedHistory = history
        .filter(h => h.role === 'user')
        .map((h, index) => {
            const nextAssistantMsg = history[index + 1]?.role === 'assistant' 
                ? history[index + 1].content 
                : '';
            return {
                user: h.content,
                assistant: nextAssistantMsg
            };
        }).filter(pair => pair.assistant !== ''); 

    const response = await api.post('/copilot/chat', {
        question,
        history: formattedHistory
    });
    
    return response.data;
};