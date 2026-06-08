import axios from 'axios';
import { useCallback, useRef, useState } from 'react';

import { TypingIndicator } from './TypingIndicator';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';
import ChatInput, { type ChatFormData } from './ChatInput';

type ChatResponse = {
    message: string;
};

const ChatBot = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [error, setError] = useState('');
    const conversationId = useRef(crypto.randomUUID());

    const onSubmit = useCallback(async ({ prompt }: ChatFormData) => {
        try {
            // ✅ Always the latest state
            // If it was "[...prev, prompt]" -> ❌ Potentially stale value
            setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
            setIsBotTyping(true);
            setError('');

            const currentConversationId = conversationId.current;

            const { data } = await axios.post<ChatResponse>('/api/chat', {
                prompt,
                conversationId: currentConversationId,
            });

            // ✅ Always the latest state
            // If it was "[...prev, data.message]" -> ❌ Potentially stale value
            setMessages((prev) => [
                ...prev,
                { content: data.message, role: 'bot' },
            ]);
        } catch (err) {
            console.error(err);
            setError('Something went wrong, try again!');
        } finally {
            setIsBotTyping(false);
        }
    }, []);

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
                <ChatMessages messages={messages} />
                {isBotTyping && <TypingIndicator />}
                {error && <p className="text-red-500">{error}</p>}
            </div>
            <ChatInput onSubmit={onSubmit} />
        </div>
    );
};

export default ChatBot;
