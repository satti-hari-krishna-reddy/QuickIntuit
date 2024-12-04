import { useState, useEffect } from 'react';
import { marked } from 'marked';
import PropTypes from 'prop-types';
import { getSummary } from '../summerize';
import Loader from './Loader';
import Draggable from 'react-draggable';
import { FaVolumeUp } from 'react-icons/fa';

function TextAdjustComponent({ text, clear }) {
  const [isAdjustOpen, setAdjustOpen] = useState(false);
  const [type, setType] = useState('Select Type');
  const [length, setLength] = useState('Select Length');
  const [summary, setSummary] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('Generating summary...');
  const [isCopied, setIsCopied] = useState(false);

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
      console.error('Error fetching summary:', error);
      setLoadingMessage('Error fetching summary. Try again later.');
      setTimeout(() => {
        clear();
      }, 3000);
    }
  };

  const handleSummerizeClick = async () => {
    console.log(`Format: ${type}, Length: ${length}`);
    fetchSummary();
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(summary)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Revert back after 2 seconds
      })
      .catch((error) => {
        console.error('Copy failed:', error);
      });
  };

  const readAloud = () => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = summary; // Use the summary text to be read aloud
    speech.lang = 'en-US'; // You can adjust language here
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    fetchSummary();
  }, [text]);

  const parseMarkdown = (markdown) => marked(markdown);

  return (
    <Draggable>
      <div
        className="draggable relative container mx-auto p-4 max-w-md rounded-lg shadow-lg z-[1000] bg-gray-50"
        style={{
          backdropFilter: 'blur(18px)',
        }}
      >
        {!summary ? (
          <Loader message={loadingMessage} />
        ) : (
          <>
            <div className="flex justify-between">
              <div className="header-text flex items-center mb-2">
                <div className="text-sm text-gray-500 mr-2">
                  Here’s a summary of the content
                </div>
                <span className="text-xs text-white bg-blue-500 rounded-full px-2 py-1">
                  AI Generated
                </span>
              </div>

              <div
                className="cursor-pointer text-gray-500 font-semibold hover:text-red-500 transition duration-150"
                onClick={clear}
              >
                X
              </div>
            </div>

            <div className="content-box p-4 bg-white rounded-md shadow-md">
              <div className="content-box p-4 rounded-md shadow-md overflow-y-auto max-h-96">
                <div
                  className="text-md font-normal text-gray-700 break-words whitespace-normal w-full"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(summary) }}
                />
              </div>

              {!isAdjustOpen ? (
                <div className="button-bar flex justify-between items-center border-t pt-2 mt-2">
                  <button
                    className="adjust-btn flex items-center text-gray-600 text-sm hover:text-gray-800 transition-all duration-300 transform hover:scale-105"
                    onClick={handleAdjustClick}
                  >
                    <span className="icon-adjust mr-1">⚙</span>
                    Adjust
                  </button>
                  <button
                    className={`${
                      isCopied
                        ? 'bg-green-400 hover:bg-green-500'
                        : 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600'
                    } text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                    onClick={copyToClipboard}
                  >
                    {isCopied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    className="read-aloud-btn text-gray-600 text-sm hover:text-gray-800 transition-all duration-300 transform hover:scale-105"
                    onClick={readAloud}
                  >
                    <FaVolumeUp />
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
                    className="select-option text-sm px-2 py-1 text-gray-600 border rounded-md bg-white"
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
                    className="select-option text-sm px-2 py-1 text-gray-600 border rounded-md bg-white"
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
    </Draggable>
  );
}

TextAdjustComponent.propTypes = {
  text: PropTypes.string.isRequired,
  clear: PropTypes.func.isRequired,
};

export default TextAdjustComponent;
