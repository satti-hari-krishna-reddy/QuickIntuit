import { useState, useEffect } from 'react';
import Loader from './Loader';
import PropTypes from 'prop-types';
import { marked } from 'marked';

function injectTailwindStyles() {
    const tailwindLink = document.createElement('link');
    tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    tailwindLink.rel = 'stylesheet';
    document.head.appendChild(tailwindLink);
}


const supportedModes = {
    "Grammar & Spelling ✏️": "Correct the grammar and spelling errors in the following text without commentary:",
    "Make Clear 💡": "Simplify the following sentence to make it clearer, more concise, and easier to understand without commentary. For example: 'The manager was responsible for the planning and execution of the project in such a way that ensured all goals were met in a timely manner.' → 'The manager planned and executed the project to meet all goals on time.' Now simplify this:",
    "Rephrase It 🔄": "Rephrase the following sentence to make it shorter, clearer, and more impactful. Focus on removing unnecessary words or simplifying complex structures while retaining the meaning without commentary. For example: 'This is something that, if we were to implement it, might possibly lead to better results.' → 'Implementing this could lead to better results.' Now rephrase this:",
    "Keep Consistent 🔗": "Ensure consistency in spelling, capitalization, and style throughout the text. Focus on making all terms and phrases uniform (e.g., spelling variations, punctuation, capitalization) without commentary. For example:'The organization’s policies were revised. The organisation also updated its website.' → 'The organization’s policies were revised. The organization also updated its website.' Now ensure consistency in this text:",
    "Word Boost 🚀": "Suggest stronger or more precise words to improve the clarity and impact of the following sentence. Aim to replace repetitive or vague words with more varied and specific vocabulary without commentary. For example: 'The results were very good and the team worked very hard.' → 'The results were excellent, and the team worked diligently.' Now enhance the vocabulary in this text:",
    "Mood Matcher 💬": "Adjust the tone of the following text to match the desired emotional tone. Focus on making it sound more polite, formal, or friendly, depending on the context without commentary. For example: 'I need this by tomorrow. Let me know if you have any questions.' → 'Could you please get this to me by tomorrow? Feel free to reach out if you have any questions.' Now adjust this",
    "Fix Punctuation 🛠️": "Correct the punctuation in the following text to ensure clarity and readability. Look for missing commas, periods, and other punctuation issues without commentary. For example: 'She said she would call however she never did.' → 'She said she would call, however, she never did.' Now fix the punctuation in this text:",
};

const WriteRight = ({ initialText, clear }) => {
    const [loadingMessage, setLoadingMessage] = useState('Improving your text...');
    const [selectedMode, setSelectedMode] = useState('');
    const [loading, setLoading] = useState(false);
    const [enhancedText, setEnhancedText] = useState('');

    let session = undefined

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
            const finalPrompt = `${supportedModes[selectedMode]}\n${trimmedInitialText}`;

            const { available } = await ai.languageModel.capabilities();
            if (available !== "no") {
                clearSession();
                 session = await ai.languageModel.create({
                    temperature : 0.2,
                    topK : 3,
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
            setTimeout(() => {clear();}, 3000);
        } finally {
            setLoading(false);
        }
    };   
    
    return (
        <div
            className="relative container mx-auto p-4 max-w-xl rounded-lg shadow-lg bg-gray-50"
            style={{ backdropFilter: 'blur(18px)' }}
        >
            {loading ? (
                <Loader message={loadingMessage} />
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                    <div className="header-text flex items-center mb-2">
                        <div className="text-sm text-gray-500 mr-2">
                            Here’s a improved version of the text
                        </div>
                        <span className="text-xs text-white bg-blue-500 rounded-full px-2 py-1">
                            AI Generated
                        </span>
                    </div> 
                    
                        <button
                            className="cursor-pointer text-gray-500 font-semibold hover:text-red-500 transition duration-150"
                            onClick={() => {
                                clear();
                                clearSession();
                              }}
                              
                        >
                            X
                        </button>
                    </div>

                    {enhancedText ? (
                        <div>
                        <div
                            className="text-md font-normal text-gray-700 break-words whitespace-normal w-full"
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(enhancedText) }}
                        />
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 mt-4 rounded-md w-full transition duration-200"
                                onClick={() => {
                                    setEnhancedText(null);
                                    clearSession();
                                }}
                            >
                                Back
                            </button>
                        </div>
                    ) : (
                        <div className="content-box p-4 bg-white rounded-md shadow-md mb-4">
                            <div className="mb-4">
                                <label className="text-md font-semibold text-gray-700 mb-1">
                                Options:
                                </label>
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
    );
};

WriteRight.propTypes = {
    initialText: PropTypes.string.isRequired,
    clear: PropTypes.func.isRequired,
};

export default WriteRight;

