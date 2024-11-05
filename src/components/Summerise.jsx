import { useState, useEffect } from 'react';
import { marked } from 'marked';
import PropTypes from 'prop-types';
import { getSummary } from '../summerize';
import Loader from './Loader';

console.log('TextAdjustComponent loaded');

function injectTailwindStyles() {
    const tailwindLink = document.createElement('link');
    tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    tailwindLink.rel = 'stylesheet';
    document.head.appendChild(tailwindLink);
}


function TextAdjustComponent({ text, clear }) {
    const [isAdjustOpen, setAdjustOpen] = useState(false);
    const [type, setType] = useState('Select Type');
    const [length, setLength] = useState('Select Length');
    const [summary, setSummary] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Generating summary...');
    
    const handleAdjustClick = () => setAdjustOpen(true);

    const handleCloseOptions = () => {
        setAdjustOpen(false);
        setType('Select Type');
        setLength('Select Length');
    };

    const fetchSummary = async () => {
        try {
            setSummary('');
            const result = await getSummary(text, type, length);
            if (result.includes('Model is currently downloading')) {
                setLoadingMessage('Model is downloading, please wait...');
            } else {
                setSummary(result);
            }
        } catch (error) {
            console.error("Error fetching summary:", error);
            setLoadingMessage("Error fetching summary. Try again later.");
            setTimeout(() => {clear();}, 3000);
        }
    };

    const handleSummerizeClick = async() => {
        console.log(`Format: ${type}, Length: ${length}`);
        fetchSummary();
    };

    useEffect(() => {
        injectTailwindStyles();
    }, []);

    useEffect(() => {
        fetchSummary();
    }, [text]);

    const parseMarkdown = (markdown) => marked(markdown);

    return (
        <div className="relative container mx-auto p-4 max-w-md rounded-md shadow-2xl z-[1000]"
        style={{
            backdropFilter: 'blur(18px)', 
        }}>
            {!summary ? (
                <Loader message={loadingMessage} />
            ) : (
                <> <div className="flex justify-between">
                    <div className="header-text flex items-center mb-2">
                        <div className="text-sm text-gray-500 mr-2">
                            Here’s a summary of the content
                        </div>
                        <span className="text-xs text-white bg-blue-500 rounded-full px-2 py-1">
                            AI Generated
                        </span>
                    </div> 
                    
                    <div className="cursor-pointer" onClick={clear}>X</div>
                    </div>
                    <div className="content-box p-4 bg-white rounded-md shadow-md">
                        <div
                            className="text-md font-normal text-gray-700 break-words whitespace-normal w-full"
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(summary) }}
                        />
                        {!isAdjustOpen ? (
                            <div className="button-bar flex justify-between items-center border-t pt-2 mt-2">
                                <button
                                    className="adjust-btn flex items-center text-gray-600 text-sm"
                                    onClick={handleAdjustClick}
                                >
                                    <span className="icon-adjust mr-1">⚙</span>
                                    Adjust
                                </button>
                            </div>
                        ) : (
                            <div className="adjust-options flex space-x-4 border-t pt-2 mt-2">
                                <button
                                    onClick={handleCloseOptions}
                                    className="close-btn text-gray-600 hover:text-gray-800 text-lg"
                                >
                                    ✖
                                </button>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="select-option text-sm px-2 py-1 text-gray-600 border rounded-md"
                                >
                                    <option hidden>Select Type</option>
                                    <option value="key-points">Key Points</option>
                                    <option value="headline">Head Lines</option>
                                    <option value="teaser">Teaser</option>
                                    <option value="tl;dr">TL;DR</option>
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
                                    onClick={handleSummerizeClick}
                                >
                                    Summerize
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

TextAdjustComponent.propTypes = {
    text: PropTypes.string.isRequired,
};
TextAdjustComponent.propTypes = {
    clear: PropTypes.func.isRequired,
};

export default TextAdjustComponent;
