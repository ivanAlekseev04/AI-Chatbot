import React, { useEffect, useRef } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';

import CodeBlock from './Codeblock';

type Props = {
    messages: Message[];
};

export type Message = {
    content: string;
    role: 'user' | 'bot';
};

// "When you parse this markdown, don't emit plain <code> and <pre> tags — call my functions for those instead."
// react-markdown still does all the parsing work (figuring out what's a code block, what's a heading, what's bold);
// it just hands the rendering of <code> and <pre> to you. Any tag you don't list keeps its default rendering
const markdownComponents: Components = {
    code({ className, children }) {
        const text = String(children);

        // Fenced blocks carry a `language-xxx` class; multi-line code without a
        // language is still a block. Everything else is inline `code`.
        const isBlock =
            className?.startsWith('language-') || text.includes('\n');

        if (!isBlock) {
            return (
                <code className="px-1.5 py-0.5 rounded bg-gray-200 text-pink-600 text-[0.9em] font-mono">
                    {children}
                </code>
            );
        }

        const language = className?.replace('language-', '') ?? '';
        return <CodeBlock language={language} value={text.trimEnd()} />;
    },
    // CodeBlock provides its own container, so collapse the default <pre>
    // wrapper to avoid nesting blocks.
    pre: ({ children }) => <>{children}</>,
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
                    className={`px-3 py-1 rounded-xl max-w-[80%] ${message.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
                >
                    <ReactMarkdown components={markdownComponents}>
                        {message.content}
                    </ReactMarkdown>
                </div>
            ))}
        </div>
    );
};

export default ChatMessages;
