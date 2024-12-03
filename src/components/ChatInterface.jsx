import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { marked } from 'marked';
import Draggable from 'react-draggable';

function ChatInterface({ text, clear }) {
  const [input, setInput] = useState(
    ' I have some text. Please explain it clearly so I can understand what it is about. here is the text: ' +
      '\n' +
      text
  );
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  let session = undefined;

  useEffect(() => {
    handleSend();
  }, []);

  const clearSession = () => {
    if (session) {
      session.destroy();
      session = undefined;
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setIsTyping(true);
    try {
      const { available } = await ai.languageModel.capabilities();
      if (available !== 'no') {
        clearSession();
        session = await ai.languageModel.create({
          temperature: 0.5,
          topK: 3,
        });
        const stream = session.promptStreaming(input);
        let fullResponse = '';
        for await (const chunk of stream) {
          fullResponse = chunk;
          console.log('Response:', fullResponse);
        }
        setMessages((prev) => [...prev, { role: 'ai', text: fullResponse }]);
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

  const getWidthForMessages = () => {
    const longestMessage = messages.reduce((max, msg) => {
      return msg.text.length > max.length ? msg.text : max;
    }, '');
    return longestMessage.length > 200 ? 'w-[600px]' : 'w-full';
  };

  return (
    <Draggable>
      <div
        className={`draggable flex flex-col items-center rounded-lg p-6 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 shadow-xl ${getWidthForMessages()} h-5/6`}
        style={{ maxHeight: '85vh', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex justify-between w-full">
          <span className="text-xs text-white bg-blue-500 rounded-full px-2 py-1">
            AI Chat
          </span>
          <div
            className="cursor-pointer text-gray-500 font-semibold hover:text-red-500 transition duration-150"
            onClick={() => {
              clear();
              clearSession();
            }}
          >
            X
          </div>
        </div>
        <div
          className="chat-content space-y-6 overflow-y-auto flex-grow w-full p-4 rounded-lg bg-white shadow-inner"
          style={{ maxHeight: '75vh' }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-4 max-w-xl rounded-2xl shadow-md ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: msg.role === 'ai' ? marked(msg.text) : msg.text,
                  }}
                  className="text-base break-words leading-relaxed"
                />
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          {isTyping && (
            <div className="flex justify-start">
              <div className="p-4 max-w-xl rounded-2xl bg-gray-300 text-gray-800 shadow-md">
                <div className="text-base flex items-center space-x-2">
                  <span className="mr-2">🤖</span>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input flex items-center mt-4 border-t pt-4 w-full">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-shadow duration-200"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isTyping}
          />
          <button
            className="ml-4 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:ring-4 focus:ring-blue-400 transition-all duration-200"
            onClick={handleSend}
            disabled={isTyping}
          >
            Send
          </button>
        </div>

        <div className="text-xs text-gray-400 mt-2">
          Powered by{' '}
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 transition-transform duration-300">
            Gemini Nano
          </span>
        </div>
      </div>
    </Draggable>
  );
}

ChatInterface.propTypes = {
  text: PropTypes.string.isRequired,
  clear: PropTypes.func.isRequired,
};

export default ChatInterface;
