import { Button } from './ui/button';
import { FaArrowCircleUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useCallback, useRef } from 'react';

type FormData = {
    prompt: string;
};

const ChatBot = () => {
    const conversationId = useRef(crypto.randomUUID());
    const { register, handleSubmit, reset, formState } = useForm<FormData>();

    const onSubmit = useCallback(
        async ({ prompt }: FormData) => {
            reset();

            const currentConversationId = conversationId.current;

            const { data } = await axios.post('/api/chat', {
                prompt,
                conversationId: currentConversationId,
            });

            console.log('Request from server:', prompt);
            console.log('Response from server:', data);
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
    );
};

export default ChatBot;
