import React, { useCallback, useState } from 'react';
import { FaCheck, FaRegCopy } from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Props = {
    language: string;
    value: string;
};

const CodeBlock = ({ language, value }: Props) => {
    const [copied, setCopied] = useState(false);

    const onCopy = useCallback(async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }, [value]);

    return (
        <div className="my-3 overflow-hidden rounded-lg border border-gray-700 bg-[#282c34] text-sm">
            {/* Header with language label + copy button */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-[#21252b] text-gray-300">
                <span className="text-xs font-mono lowercase">
                    {language || 'text'}
                </span>
                <button
                    type="button"
                    onClick={onCopy}
                    className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors"
                >
                    {copied ? <FaCheck /> : <FaRegCopy />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>

            <SyntaxHighlighter
                language={language || 'text'}
                style={oneDark}
                customStyle={{
                    margin: 0,
                    background: 'transparent',
                    padding: '1rem',
                }}
                PreTag="div"
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;
