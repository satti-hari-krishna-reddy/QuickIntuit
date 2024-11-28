import { useState, useEffect } from 'react';
import { marked } from 'marked';
import PropTypes from 'prop-types';
import Loader from './Loader';

function injectTailwindStyles() {
    const tailwindLink = document.createElement('link');
    tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    tailwindLink.rel = 'stylesheet';
    document.head.appendChild(tailwindLink);
}

function Write({ clear }) {
    const [aiText, setAiText] = useState('');
    const [tone, setTone] = useState('');
    const [length, setLength] = useState('');
    const [prompt, setPrompt] = useState('');
    const [context, setContext] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [showCopied, setShowCopied] = useState(false);

    let writer = undefined;
    const clearWriter = () => {
        if (writer) {
            writer.destroy();
            writer = undefined;
        }
    };

    const handleWriteClick = async () => {
        if (prompt.trim() === '') {
            setPrompt('Please provide a prompt');
            return;
        }
        if (context.trim() === ''){
            setContext('Please provide a context');
             return;
        }
        setIsTyping(true);
        setLoadingMessage('Crafting your message...');
        try {
            const { available } = await ai.languageModel.capabilities();
            if (available !== 'no') {
                clearWriter();
                writer = await self.ai.writer.create({
                    tone: tone || 'neutral',
                    length: length || 'long',
                    format: 'markdown',
                    sharedContext: context,
                });
                const stream = await writer.writeStreaming(prompt);
                let fullResponse = '';
                for await (const chunk of stream) {
                    fullResponse = chunk;
                }
                setAiText(fullResponse);
                setIsTyping(false);
            }
        } catch (error) {
            setLoadingMessage('AI interaction failed :(');
            console.error('AI interaction failed:', error);
            setTimeout(() => {
                clear(); 
                clearWriter();}, 3000);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(aiText);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    };

    useEffect(() => {
        injectTailwindStyles();
    }, []);

    const parseMarkdown = (markdown) => marked(markdown);

    return (
        <div
            className="relative container mx-auto p-4 max-w-lg rounded-lg shadow-lg z-[1000] bg-gray-50"
            style={{
                backdropFilter: 'blur(18px)',
            }}
        >
            {isTyping ? (
                <Loader message={loadingMessage} />
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <div className="header-text flex items-center">
                            <span className="text-xs text-white bg-blue-500 rounded-full px-2 py-1">
                                AI Generated
                            </span>
                        </div>
                        <div className="flex space-x-3 items-center">
                            {aiText && (
                                <div
                                    className="text-green-500 hover:text-blue-500 cursor-pointer"
                                    onClick={copyToClipboard}
                                >
                                    Copy
                                </div>
                            )}
                            <div
                                className="cursor-pointer text-gray-500 font-semibold hover:text-red-500 transition duration-150"
                                onClick={() => {
                                    clear();
                                    clearWriter();
                                  }}
                            >
                                X
                            </div>
                        </div>
                    </div>
                    {showCopied && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white text-sm px-3 py-1 rounded">
                            Copied!
                        </div>
                    )}
                    {!aiText ? (
                        <>
                            <div className="content-box p-4 bg-white rounded-md shadow-md space-y-4">
                                <div className="flex flex-col space-y-3">
                                    <textarea
                                        className="flex-grow p-3 h-32 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-shadow duration-200 resize-none overflow-y-auto"
                                        placeholder="Type your prompt..."
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        style={{ minHeight: '100px', maxHeight: '300px' }}
                                    />
                                    <textarea
                                        className="flex-grow p-3 h-32 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-shadow duration-200 resize-none overflow-y-auto"
                                        placeholder="Your context..."
                                        value={context}
                                        onChange={(e) => setContext(e.target.value)}
                                        style={{ minHeight: '100px', maxHeight: '300px' }}
                                    />
                                </div>
                                <div className="adjust-options flex space-x-4 border-t pt-2 mt-2">
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="select-option text-sm px-2 py-1 text-gray-600 border rounded-md"
                                    >
                                        <option hidden> Select Tone</option>
                                        <option value="neutral">Neutral</option>
                                        <option value="formal">Formal</option>
                                        <option value="casual">Casual</option>
                                    </select>
                                    <select
                                        value={length}
                                        onChange={(e) => setLength(e.target.value)}
                                        className="select-option text-sm px-2 py-1 text-gray-600 border rounded-md"
                                    >
                                        <option hidden>Select Length</option>
                                        <option value="short">Short</option>
                                        <option value="medium">Medium</option>
                                        <option value="long">Long</option>
                                    </select>
                                    <button
                                        className="rewrite-btn text-white bg-blue-500 px-3 py-1 rounded-md text-sm"
                                        onClick={handleWriteClick}
                                    >
                                        Write
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className="text-md font-normal text-gray-800 leading-relaxed whitespace-pre-wrap break-words border border-gray-200 rounded-lg p-4 bg-white"
                                dangerouslySetInnerHTML={{ __html: parseMarkdown(aiText) }}
                            />
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 mt-4 rounded-md w-full transition duration-200"
                                onClick={() => {
                                    setAiText('');
                                    setIsTyping(false);
                                }}
                            >
                                Back
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

Write.propTypes = {
    clear: PropTypes.func.isRequired,
};

export default Write;