import { useState } from 'react';
import Loader from './Loader';
import PropTypes from 'prop-types';
import { marked } from 'marked';
import Draggable from 'react-draggable';

const supportedModes = {
  'Grammar & Spelling ✏️':
    'Fix all grammar, punctuation, and spelling errors in the text below. Return the corrected text only, formatted exactly as intended for use. No additional comments or examples: \n',

  'Rephrase It 🔄':
    'Rephrase the text below to improve readability and flow. Focus on enhancing clarity and maintaining the original meaning. Preserve the style and tone unless specified otherwise. Return only the rephrased text without commentary: \n',

  'Keep Consistent 🔗':
    'Ensure consistency in the text below. Standardize spelling, capitalization, punctuation, and stylistic elements throughout. Return the uniform and corrected text only, without commentary or examples: \n',

  'Word Boost 🚀':
    'Improve the text below by replacing vague or repetitive words with stronger, more precise alternatives. Retain the tone and meaning. Return the improved text only, without commentary or suggestions: \n',

  'Mood Enhancer 💬':
    'Adjust the tone of the text below to match the specified mood or context (e.g., friendly, formal, conversational). Ensure the revised text fits seamlessly with the desired tone. Return only the updated text, with no commentary or examples: \n',
};

const WriteRight = ({ initialText, clear, replaceText }) => {
  const [loadingMessage, setLoadingMessage] = useState(
    'Improving your text...'
  );
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [loading, setLoading] = useState(false);
  const [enhancedText, setEnhancedText] = useState('');
  let session = undefined;

  const parseMarkdown = (markdown) => marked(markdown);

  const clearSession = () => {
    if (session) {
      session.destroy();
      session = undefined;
    }
  };

  const handleEnhanceText = async () => {
    setLoading(true);
    setEnhancedText(null);

    if (initialText === '' || selectedMode === '') {
      setLoading(false);
      return;
    }

    try {
      const trimmedInitialText = initialText;
      let finalPrompt = `${supportedModes[selectedMode]}${trimmedInitialText}`;

      // Add tone to the prompt for Mood Enhancer
      if (selectedMode === 'Mood Enhancer 💬' && selectedTone) {
        finalPrompt += ` The tone should be: ${selectedTone}.`;
      }

      const { available } = await ai.languageModel.capabilities();
      if (available !== 'no') {
        clearSession();
        session = await ai.languageModel.create({
          temperature: 0.2,
          topK: 3,
        });
        console.log('Prompt:', finalPrompt);

        const stream = session.promptStreaming(finalPrompt);
        let fullResponse = '';
        for await (const chunk of stream) {
          fullResponse = chunk;
          console.log('Response:', fullResponse);
        }
        setEnhancedText(fullResponse);
      }
    } catch (error) {
      setLoadingMessage('Error improving your text.');
      console.error('AI interaction failed:', error);
      setTimeout(() => {
        clear();
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Draggable>
      <div
        className="draggable relative container mx-auto p-4 max-w-xl rounded-lg shadow-lg bg-gray-50"
        style={{ backdropFilter: 'blur(12px)' }}
      >
        {loading ? (
          <Loader message={loadingMessage} />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="header-text flex items-center">
                {enhancedText && (
                  <div className="text-sm text-gray-600 font-medium mr-3">
                    Here’s an improved version:
                  </div>
                )}
                <span className="text-xs text-white bg-blue-600 rounded-full px-3 py-1 font-semibold shadow-sm">
                  AI Generated
                </span>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 transition duration-200"
                onClick={() => {
                  clear();
                  clearSession();
                  setEnhancedText(null);
                }}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {enhancedText ? (
              <div>
                <div
                  className="text-md font-normal text-gray-700 bg-gray-100 p-4 rounded-lg shadow-sm break-words whitespace-pre-wrap max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdown(enhancedText),
                  }}
                />
                <div className="flex gap-4 mt-6">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium w-full transition duration-200 shadow-md"
                    onClick={() => {
                      replaceText(enhancedText);
                    }}
                  >
                    Replace
                  </button>
                  <button
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium w-full transition duration-200 shadow-md"
                    onClick={() => {
                      setEnhancedText(null);
                      clearSession();
                    }}
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : (
              <div className="content-box bg-gray-50 p-5 rounded-lg shadow-md">
                <div className="mb-5">
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Options:
                  </label>
                  <select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    className="text-sm px-3 py-2 text-gray-700 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
                  >
                    <option hidden>Select Mode</option>
                    {Object.keys(supportedModes).map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedMode === 'Mood Enhancer 💬' && (
                  <div className="mb-5">
                    <label className="block text-md font-semibold text-gray-700 mb-2">
                      Select Tone:
                    </label>
                    <select
                      value={selectedTone}
                      onChange={(e) => setSelectedTone(e.target.value)}
                      className="text-sm px-3 py-2 text-gray-700 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
                    >
                      <option hidden>Select Tone</option>
                      <option value="Confident">Confident</option>
                      <option value="Friendly">Friendly</option>
                      <option value="Formal">Formal</option>
                      <option value="Neutral">Neutral</option>
                    </select>
                  </div>
                )}

                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium w-full transition duration-200 shadow-md"
                  onClick={handleEnhanceText}
                >
                  Refine
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Draggable>
  );
};

WriteRight.propTypes = {
  initialText: PropTypes.string.isRequired,
  clear: PropTypes.func.isRequired,
  replaceText: PropTypes.func.isRequired,
};

export default WriteRight;
