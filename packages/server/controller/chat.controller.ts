import type { Request, Response } from 'express';
import { chatService } from '../service/chat.service';
import z from 'zod';

// Implemenatation detail (e.g. how the request is validated is not smth that should be exposed)
// In order to reduce wasting of tokens and failures we should validate min/max input length
const chatSchema = z.object({
    prompt: z
        .string()
        .trim()
        .min(1, 'Prompt is required.')
        .max(1000, 'Prompt is too long (max 1000 characters).'),
    conversationId: z.uuid(),
});

// Public interface
export const chatController = {
    async sendMessage(req: Request, res: Response) {
        const parseResult = chatSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json(z.prettifyError(parseResult.error));
            return;
        }

        try {
            const { prompt, conversationId } = req.body;
            const response = await chatService.sendMessage(
                prompt,
                conversationId
            );

            res.json({ message: response.message });
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate a response.' });
        }
    },
};
