import { useState, useEffect } from 'react';
import Loader from './Loader';
import PropTypes from 'prop-types';
import { marked } from 'marked';
import Draggable from 'react-draggable';

function injectTailwindStyles() {
    const tailwindLink = document.createElement('link');
    tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    tailwindLink.rel = 'stylesheet';
    document.head.appendChild(tailwindLink);
}

const supportedModes = {
    "Grammar & Spelling ✏️": "Correct the grammar and spelling errors in the following text. Provide corrections only, no commentary, and show examples: \n",
    "Rephrase It 🔄": "Rephrase the following sentence to make it shorter, clearer, and more impactful. Focus on removing unnecessary words or simplifying complex structures while retaining the meaning. Provide examples: \n",
    "Keep Consistent 🔗": "Ensure consistency in spelling, capitalization, and style throughout the text. Focus on making all terms and phrases uniform (e.g., spelling variations, punctuation, capitalization). Provide examples: \n",
    "Word Boost 🚀": "Suggest stronger or more precise words to improve the clarity and impact of the following sentence. Aim to replace repetitive or vague words with more varied and specific vocabulary. Provide examples: \n",
    "Mood Enhancer 💬": "Adjust the tone of the following text based on the context. If the text is too formal, suggest making it friendlier or more conversational. If it’s too informal, suggest making it more formal. Provide examples: \n",
};

const WriteRight = ({ initialText, clear, replaceText }) => {
    const [loadingMessage, setLoadingMessage] = useState('Improving your text...');
    const [selectedMode, setSelectedMode] = useState('');
    const [selectedTone, setSelectedTone] = useState(''); // For Mood Enhancer tone
    const [loading, setLoading] = useState(false);
    const [enhancedText, setEnhancedText] = useState('');
    let session = undefined;

    useEffect(() => {
        injectTailwindStyles();
    }, []);

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
            if (selectedMode === "Mood Enhancer 💬" && selectedTone) {
                finalPrompt += ` The tone should be: ${selectedTone}.`;
            }

            const { available } = await ai.languageModel.capabilities();
            if (available !== "no") {
                clearSession();
                session = await ai.languageModel.create({
                    temperature: 0.2,
                    topK: 3,
                });
                console.log('Prompt:', finalPrompt);

                const stream = session.promptStreaming(finalPrompt);
                let fullResponse = "";
                for await (const chunk of stream) {
                    fullResponse = chunk;
                    console.log('Response:', fullResponse);
                }
                setEnhancedText(fullResponse);
            }
        } catch (error) {
            setLoadingMessage('Error improving your text.');
            console.error('AI interaction failed:', error);
            setTimeout(() => { clear(); }, 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Draggable>
        <div className="relative container mx-auto p-4 max-w-xl rounded-lg shadow-lg bg-gray-50" style={{ backdropFilter: 'blur(18px)' }}>
            {loading ? (
                <Loader message={loadingMessage} />
            ) : (
                <>
                        <div className="flex justify-between items-center mb-4">
                            <div className="header-text flex items-center mb-2">
                            {enhancedText && (  <div className="text-sm text-gray-700 mr-2">
                                    Here’s an improved version
                                </div>          )}
                                <span className="text-xs text-white bg-blue-500 rounded-full px-2 py-1">
                                    AI Generated
                                </span>
                            </div>
                            <button
                                className="cursor-pointer text-gray-500 font-semibold hover:text-red-500 transition duration-150"
                                onClick={() => {
                                    clear();
                                    clearSession();
                                    setEnhancedText(null);
                                }}
                            >
                                X
                            </button>
                        </div>
     
                    {enhancedText ? (
                        <div>
                            <div
                                className="text-md font-normal text-gray-800 bg-white p-4 rounded-md shadow-md break-words whitespace-normal w-full overflow-y-auto max-h-96"
                                dangerouslySetInnerHTML={{ __html: parseMarkdown(enhancedText) }}
                            />
                            <div className="flex gap-4 mt-4">
                            <button
                                    className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-md w-full transition duration-200"
                                    onClick={() => {
                                        replaceText(enhancedText);
                                    }}
                                >
                                    Replace
                                </button>
                                <button
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md w-full transition duration-200"
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
                        <div className="content-box p-4 bg-white rounded-md shadow-md mb-4">
                            <div className="mb-4">
                                <label className="text-md font-semibold text-gray-700 mb-1">Options:</label>
                                <select
                                    value={selectedMode}
                                    onChange={(e) => setSelectedMode(e.target.value)}
                                    className="select-option text-sm px-2 py-1 text-gray-600 border border-gray-300 rounded-md w-full"
                                >
                                    <option hidden>Select Mode</option>
                                    {Object.keys(supportedModes).map((key) => (
                                        <option key={key} value={key}>
                                            {key}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Show tone selection only when Mood Enhancer is selected */}
                            {selectedMode === 'Mood Enhancer 💬' && (
                                <div className="mb-4">
                                    <label className="text-md font-semibold text-gray-700 mb-1">Select Tone:</label>
                                    <select
                                        value={selectedTone}
                                        onChange={(e) => setSelectedTone(e.target.value)}
                                        className="select-option text-sm px-2 py-1 text-gray-600 border border-gray-300 rounded-md w-full"
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
                                className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-md w-full transition duration-200"
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
