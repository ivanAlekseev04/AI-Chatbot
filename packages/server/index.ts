import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import express from 'express';
import { chatController } from './controller/chat.controller';

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

app.post('/api/chat', chatController.sendMessage);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
