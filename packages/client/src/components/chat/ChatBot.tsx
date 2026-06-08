import axios from 'axios';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowCircleUp } from 'react-icons/fa';
import { Button } from '../ui/button';
import { TypingIndicator } from './TypingIndicator';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';

type FormData = {
    prompt: string;
};

type ChatResponse = {
    message: string;
};

const ChatBot = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [error, setError] = useState('');
    const conversationId = useRef(crypto.randomUUID());
    const { register, handleSubmit, reset, formState } = useForm<FormData>();

    const onSubmit = useCallback(
        async ({ prompt }: FormData) => {
            try {
                // ✅ Always the latest state
                // If it was "[...prev, prompt]" -> ❌ Potentially stale value
                setMessages((prev) => [
                    ...prev,
                    { content: prompt, role: 'user' },
                ]);
                setIsBotTyping(true);
                setError('');

                reset({ prompt: '' }); // Providing the default value for the "prompt" field when resetting the form

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
        },
        [reset]
    );

    const onFormSubmit = useCallback(
        (e: React.SubmitEvent<HTMLFormElement>) => {
            handleSubmit(onSubmit)(e);
        },
        [handleSubmit, onSubmit]
    );

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLFormElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(onSubmit)();
            }
        },
        [handleSubmit, onSubmit]
    );

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
                <ChatMessages messages={messages} />
                {isBotTyping && <TypingIndicator />}
                {error && <p className="text-red-500">{error}</p>}
            </div>
            <form
                onSubmit={onFormSubmit} // function "onSubmit" reference, not the function call
                onKeyDown={onKeyDown}
                className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
            >
                <textarea
                    {...register('prompt', {
                        required: true,
                        validate: (data) =>
                            data.trim().length > 0 || 'Prompt cannot be empty',
                    })}
                    autoFocus
                    className="w-full border-0 focus:outline-0 resize-none"
                    placeholder="Ask anything"
                    maxLength={1000}
                />
                <Button
                    disabled={!formState.isValid}
                    type="submit"
                    className="rounded-full w-9 h-9"
                >
                    {/* We are giving fixed length/width to the Button since only the square can be made a perfect circle */}
                    <FaArrowCircleUp />
                </Button>
            </form>
        </div>
    );
};

export default ChatBot;
