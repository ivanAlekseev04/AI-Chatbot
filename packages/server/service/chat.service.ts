import OpenAI from 'openai';
import { conversationRepository } from '../repository/conversation.repository';
import type { ChatResponse } from '../model/chat.response';

// Implementation detail
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Public interface
// Ensures abstraction over the AI model (example: OpenAI today, Anthropic can be tomorrow) by the ChatResponse
// class that is created internally in the function and is not exposing OpenAI specific ".output_text" method
export const chatService = {
    async sendMessage(
        prompt: string,
        conversationId: string
    ): Promise<ChatResponse> {
        const response = await client.responses.create({
            model: 'gpt-5.4-mini',
            input: prompt,
            temperature: 0.2,
            max_output_tokens: 400,
            previous_response_id:
                conversationRepository.getLastResponseId(conversationId),
        });

        conversationRepository.setLastResponseId(conversationId, response.id);

        return { id: response.id, message: response.output_text };
    },
};
