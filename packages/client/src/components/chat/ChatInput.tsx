import React, { useCallback } from 'react';
import { Button } from '../ui/button';
import { FaArrowCircleUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

export type ChatFormData = {
    prompt: string;
};

type Props = {
    onSubmit: (data: ChatFormData) => void;
};

const ChatInput = ({ onSubmit }: Props) => {
    const { register, handleSubmit, reset, formState } =
        useForm<ChatFormData>();

    const handleFormSubmit = handleSubmit((data) => {
        reset({ prompt: '' }); // Providing the default value for the "prompt" field when resetting the form
        onSubmit(data);
    });

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLFormElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleFormSubmit();
            }
        },
        [handleFormSubmit]
    );

    return (
        <form
            onSubmit={handleFormSubmit} // function "onSubmit" reference, not the function call
            onKeyDown={handleKeyDown}
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
    );
};

export default ChatInput;
