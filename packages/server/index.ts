import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import z from 'zod';
import { chatService } from './service/chat.service';

dotenv.config();

const app = express();

app.use(express.json());
// middleware function to parse the request before it reaches the endpoint
// 1. Looks at the Content-Type: application/json header of incoming requests
// 2. Reads the raw request body (a JSON string)
// 3. Parses it into a JavaScript object
// 4. Attaches the result to req.body

// Without it the retrieving of the request body won't give a JSON object, but will give "undefined" instead
// The reason for that is that HTTP transfers the request body as a raw sequence of bytes

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world !');
});

app.get('/api/hello', (req: Request, res: Response) => {
    res.json({ message: 'Hello world !' });
});

// In order to reduce wasting of tokens and failures we should validate min/max input length
const chatSchema = z.object({
    prompt: z
        .string()
        .trim()
        .min(1, 'Prompt is required.')
        .max(1000, 'Prompt is too long (max 1000 characters).'),
    conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
        res.status(400).json(z.prettifyError(parseResult.error));
        return;
    }

    try {
        const { prompt, conversationId } = req.body;

        const response = await chatService.sendMessage(prompt, conversationId);

        res.json({ message: response.message });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate a response.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
