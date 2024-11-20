import { useState, useEffect, useRef } from 'react';
import { marked} from 'marked';

function injectTailwindStyles() {
    const tailwindLink = document.createElement('link');
    tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    tailwindLink.rel = 'stylesheet';
    document.head.appendChild(tailwindLink);
}

function ChatInterface() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        injectTailwindStyles();
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '') return;

        // Add user's message to the chat
        const userMessage = { role: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        // Simulate AI response with a loading animation
        setIsTyping(true);
        try {
            const { available } = await ai.languageModel.capabilities();
            if (available !== "no") {
                const session = await ai.languageModel.create({
                    temperature : 0.5,
                    topK : 3,
                });
                const result = await session.prompt(input);
                setMessages((prev) => [...prev, { role: 'ai', text: result }]);
            }
        } catch (error) {
            console.error('AI interaction failed:', error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="flex flex-col items-center rounded-lg p-4 bg-gray-50 shadow-lg w-full max-w-3xl h-5/6" style={{ maxHeight: '80vh', backdropFilter: 'blur(18px)', }}>
            <div className="chat-content space-y-4 overflow-y-auto flex-grow w-full p-3 rounded-md" style={{ maxHeight: '70vh' }}>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2 max-w-xs rounded-lg shadow ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <div dangerouslySetInnerHTML={{ __html: msg.role === 'ai' ? marked(msg.text) : msg.text }} className="text-sm break-words" />
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="p-2 max-w-xs rounded-lg bg-gray-300 text-gray-800 shadow">
                            <div className="text-sm flex items-center">
                                <span className="mr-1">🤖</span>
                                <div className="flex space-x-1">
                                    <div className="w-1 h-1 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-1 h-1 bg-gray-600 rounded-full animate-bounce delay-200"></div>
                                    <div className="w-1 h-1 bg-gray-600 rounded-full animate-bounce delay-300"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="chat-input flex items-center mt-2 border-t pt-2 w-full">
                <input
                    type="text"
                    className="flex-grow p-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isTyping}
                />
                <button
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150"
                    onClick={handleSend}
                    disabled={isTyping}
                >
                    ➤
                </button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
                Powered by{' '}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:scale-105 transition-transform duration-200">
                    Gemini Nano
                </span>
            </div>
        </div>
    );
}

export default ChatInterface;
