import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

type Props = {
    messages: Message[];
};

export type Message = {
    content: string;
    role: 'user' | 'bot';
};

const ChatMessages = ({ messages }: Props) => {
    const lastMessageRef = useRef<HTMLDivElement | null>(null);

    // Whenever "messages[]" is changing, this hook is called and scrolls the form into view (scrolls to the bottom of the chat)
    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const onCopyMessage = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
        const selection = window.getSelection()?.toString().trim();
        if (selection) {
            e.preventDefault();
            e.clipboardData.setData('text/plain', selection);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {messages.map((message, index) => (
                <div
                    key={index}
                    onCopy={onCopyMessage}
                    ref={index === messages.length - 1 ? lastMessageRef : null}
                    className={`px-3 py-1 rounded-xl ${message.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
                >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
            ))}
        </div>
    );
};

export default ChatMessages;
