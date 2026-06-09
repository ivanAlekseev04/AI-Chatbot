import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { conversationRepository } from '../repository/conversation.repository';
import type { ChatResponse } from '../model/chat.response';
import template from '../prompts/chatbot.txt'; // Importing guidalance for the response generation

// Implementation detail
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const parkInfo = fs.readFileSync(
    path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
    'utf-8'
);
const instructions = template.replace('{parkInfo}', parkInfo); // Replacing the placeholder in the template with the actual park information

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
            instructions,
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
