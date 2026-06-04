import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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

app.post('/api/chat', async (req: Request, res: Response) => {
    const { prompt } = req.body;

    const response = await client.responses.create({
        model: 'gpt-5.4-mini',
        input: prompt,
        temperature: 0.2,
        max_output_tokens: 100,
    });

    res.json({ message: response.output_text });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
