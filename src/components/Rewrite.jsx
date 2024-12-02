import { useState, useEffect } from 'react';
import { marked } from 'marked';
import PropTypes from 'prop-types';
import Loader from './Loader';
import Draggable from 'react-draggable';

function ReWrite({ text, clear, replaceText }) {
    const [isAdjustOpen, setAdjustOpen] = useState(false);
    const [tone, setTone] = useState('');
    const [rewrited, setRewrited] = useState('');
    const [format, setFormat] = useState('');
    const [loadingMessage, setLoadingMessage] = useState('Rewriting your draft...');

    const context = "The provided text needs to be rewritten while preserving its original meaning and improving clarity, and readability. Ensure the output strictly follows the selected format without introducing any additional formatting (unless specified) or commentary."
    
    const handleAdjustClick = () => setAdjustOpen(true);

    const handleCloseOptions = () => {
        setAdjustOpen(false);
        setTone('');
        setFormat('');
    };

    let rewriter = undefined;
    const clearRewriter = () => {
        if (rewriter) {
            rewriter.destroy();
            rewriter = undefined;
        }
    };

    const handleReWriteClick = async () => {
        setRewrited('');
        setLoadingMessage('Rewriting your draft...');
        try {
            const { available } = await ai.languageModel.capabilities();
            if (available !== 'no') {
                clearRewriter();
                rewriter = await ai.rewriter.create({
                    tone:  tone || 'more-formal',
                    format: format || 'as-is',
                    sharedContext: context,
                  });
                const stream = await rewriter.rewriteStreaming(text);
                let fullResponse = '';
                for await (const chunk of stream) {
                    fullResponse = chunk;
                }
                setRewrited(fullResponse);
            }
        } catch (error) {
            setLoadingMessage('AI interaction failed :(');
            console.error('AI interaction failed:', error);
            setTimeout(() => {
                clear(); 
                clearRewriter();}, 3000);
        }
    };

    useEffect(() => {
        handleReWriteClick();
    }, [text]);

    const parseMarkdown = (markdown) => marked(markdown);

    return (
        <Draggable>
       <div className="draggable relative container mx-auto p-4 max-w-md rounded-lg shadow-lg z-[1000] bg-gray-50"
        style={{
            backdropFilter: 'blur(18px)', 
        }}>
            {!rewrited ? (
                <Loader message={loadingMessage} />
            ) : (
                <> <div className="flex justify-between">
                    <div className="header-text flex items-center mb-2">
                        <div className="text-sm text-gray-500 mr-2">
                        Here is another way of writing this
                        </div>
                        <span className="text-xs text-white bg-blue-500 rounded-full px-2 py-1">
                            AI Generated
                        </span>
                    </div> 
                    
                    <div className="cursor-pointer text-gray-500 font-semibold hover:text-red-500 transition duration-150" 
                                onClick={() => {
                                    clear();
                                    clearRewriter() }
                                }>
                            X
                        </div>
                    </div>
                    <div className="content-box p-4 bg-white rounded-md shadow-md">
                    <div className="content-box p-4 rounded-md shadow-md overflow-y-auto max-h-96">
                        <div
                            className="text-md font-normal text-gray-700 break-words whitespace-normal w-full"
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(rewrited) }}
                        />
                        </div>
                        {!isAdjustOpen ? (
                            <div className="button-bar flex justify-between items-center border-t pt-2 mt-2">
                                <button
                                    className="adjust-btn flex items-center text-gray-600 text-sm"
                                    onClick={() => {
                                        replaceText(rewrited);
                                    }}
                                >
                                    <span className="icon-adjust mr-1">🔄</span>
                                    Replace
                                </button>
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
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                    className="select-option text-sm px-2 py-1 text-gray-600 border rounded-md"
                                >
                                    <option hidden>Tone</option>
                                    <option value="as-is">As Is</option>
                                    <option value="more-formal">More Formal</option>
                                    <option value="more-casual">More Casual</option>
                                </select>
                                <select
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    className="select-option text-sm px-2 py-1 text-gray-600 border rounded-md"
                                >
                                    <option hidden>Format</option>
                                    <option value="as-is">As Is</option>
                                    <option value="markdown">Markdown</option>
                                </select>
                                <button
                                    className="rewrite-btn text-white bg-blue-500 px-3 py-1 rounded-md text-sm"
                                    onClick={handleReWriteClick}
                                >
                                    Rewrite
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
        </Draggable>
    );
}

ReWrite.propTypes = {
    text: PropTypes.string.isRequired,
};
ReWrite.propTypes = {
    clear: PropTypes.func.isRequired,
};
ReWrite.propTypes = {
    replaceText: PropTypes.func.isRequired,
};

export default ReWrite;
