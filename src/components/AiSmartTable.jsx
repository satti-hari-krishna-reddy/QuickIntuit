import '../index.css';
import { useState } from 'react';
import Loader from './Loader';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';

const supportedModes = {
  '⭐ Pros and Cons Table':
    'summerise this textual data into a table of pros and cons',
  '🔑 Key Takeaways':
    'Summarize the given text into a table with two columns: 1. Key Point, 2. Details, for the Details coloum focus on capturing the most important highlights and their explanations in a clean, structured table format.',
  '⚖️ Compare & Contrast':
    'Create a table with two sections: "Similarities" and "Differences". Clearly list common points under "Similarities" and contrasting points under "Differences".',
  '📋 Actionable Insights':
    'Extract actionable recommendations or next steps from the text in a table format with two columns: 1. Actionable Insight: The specific action or strategy. 2. Reasoning: Why this action is important or relevant.',
  '🔍 Cause-Effect Breakdown':
    'Identify cause-and-effect relationships from the text and present them in a table with two columns: 1. Cause: The reason or trigger. 2. Effect: The result or consequence.',
  '⚙️ Decision Flow Chart':
    'Create a table with three columns: "Decision Point", "Options", and "Outcome". For each key decision, list the question under "Decision Point", the available choices under "Options", and the result of each choice under "Outcome" with clear and concise descriptions.',
  '❓ Questions & Answers':
    'Create a table with two columns: 1. Question: A relevant question about the text. 2. Answer: A concise answer based on the content.',
  '📊 Data Analysis Table':
    'Create a structured table to organize relevant data points from the text. Include columns for "Numerical Values", "Categories", and "Key Descriptions". Focus on summarizing explicit data accurately without making inferences. If no numerical data is provided, organize available facts clearly and logically in the table.',
  '📅 Timeline Table':
    'Create a table with two columns: "Event" and "Date/Time". For each entry, list the name or title of the event under "Event" and the corresponding date or time it occurred under "Date/Time". Ensure the sequence of events is clear and organized chronologically.',
  '🧠 Relationship Mapping Table':
    "Analyze the relationships or connections between elements in the text and present them in a table with three columns: 'Element 1', 'Connection/Relation', and 'Element 2'. Include thematic or logical connections where relevant.",
  '📖 Chapter Summary':
    "Please generate a summary for each chapter or section of the text in a table format. The table should have three columns: 'Chapter Number', 'Chapter Title', and 'Key Points'. For each chapter, provide the chapter number, title, and a brief summary of the main points covered.",
  '😊 Sentiment Analysis':
    'Create a table with two columns: "Text Segment" and "Sentiment". Break down the text into specific, meaningful parts under "Text Segment" and classify each as "Positive", "Negative", or "Neutral" under "Sentiment". Ensure clarity by focusing on distinct emotional tones for each segment.',
};

const AiSmartTable = ({ initialText, clear }) => {
  const [loadingMessage, setLoadingMessage] = useState(
    'Generating the table...'
  );
  const [selectedMode, setSelectedMode] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedTable, setParsedTable] = useState(null);

  let session = undefined;

  const parseMarkdownTable = (markdown) => {
    const rows = markdown.split('\n').filter((row) => row.includes('|'));
    if (rows.length < 2) return null; // Invalid table (needs header + at least one row)

    const headers = rows[0]
      .split('|')
      .map((cell) => cell.trim())
      .filter(Boolean);
    const dataRows = rows.slice(1).map((row) =>
      row
        .split('|')
        .map((cell) => cell.trim())
        .filter(Boolean)
    );

    return { headers, rows: dataRows };
  };

  const clearSession = () => {
    if (session) {
      session.destroy();
      session = undefined;
    }
  };

  const handleCreateTable = async () => {
    setLoading(true);
    setParsedTable(null);

    if (initialText === '' || selectedMode === '') {
      setLoading(false);
      return;
    }

    try {
      const trimmedInitialText = initialText;
      const finalPrompt = `${trimmedInitialText}\n${supportedModes[selectedMode]}`;

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

        const tableData = parseMarkdownTable(fullResponse);
        setParsedTable(tableData);
      }
    } catch (error) {
      setLoadingMessage('Error generating the table.');
      console.error('AI interaction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTable = () => {
    // Check if parsedTable exists and has valid structure
    if (
      !parsedTable ||
      !Array.isArray(parsedTable.headers) ||
      !Array.isArray(parsedTable.rows)
    ) {
      console.log('Invalid or missing table data.');
      return <div>No data to display.</div>;
    }

    // Handle empty table scenario
    if (parsedTable.headers.length === 0 || parsedTable.rows.length === 0) {
      return <div>No data available.</div>;
    }

    return (
      <div className="relative max-w-full overflow-x-auto border border-gray-300 rounded-lg">
        <table className="table-auto w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {parsedTable.headers.map((header, idx) => (
                <th
                  key={idx}
                  className="px-4 py-2 text-left border border-gray-300"
                  scope="col" // Accessibility improvement
                >
                  {header.split(/(\*\*.*?\*\*|## .*)/g).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      // Bold syntax
                      return <strong key={i}>{part.slice(2, -2)}</strong>;
                    } else if (part.startsWith('## ')) {
                      // Markdown header (## Key Point)
                      return (
                        <span key={i} className="text-lg font-bold">
                          {part.slice(3)}
                        </span>
                      );
                    } else {
                      // Plain text
                      return part;
                    }
                  })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parsedTable.rows.map((row, rowIdx) =>
              // Skip rows that act as dividers (all cells === "---")
              Array.isArray(row) &&
              row.every((cell) => cell === '---') ? null : (
                <tr key={rowIdx} className="odd:bg-white even:bg-gray-50">
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className="px-4 py-2 border border-gray-300"
                    >
                      {/* Replace only valid bold syntax **text** with bold */}
                      {cell
                        .split(/(\*\*.*?\*\*)/g)
                        .map((part, i) =>
                          part.startsWith('**') && part.endsWith('**') ? (
                            <strong key={i}>{part.slice(2, -2)}</strong>
                          ) : (
                            part
                          )
                        )}
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Draggable>
      <div
        className="draggable relative container mx-auto p-4 max-w-xl rounded-lg shadow-lg bg-gray-50"
        style={{ backdropFilter: 'blur(18px)' }}
      >
        {loading ? (
          <Loader message={loadingMessage} />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="text-xs text-white bg-blue-500 rounded-full px-3 py-1 font-semibold">
                AI Generated
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

            {parsedTable ? (
              <div>
                <div className="max-h-96 overflow-y-auto">{renderTable()}</div>
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 mt-4 rounded-md w-full transition duration-200"
                  onClick={() => {
                    setParsedTable(null);
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
                    Analysis Mode:
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
                  onClick={handleCreateTable}
                >
                  Generate
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Draggable>
  );
};

AiSmartTable.propTypes = {
  initialText: PropTypes.string.isRequired,
  clear: PropTypes.func.isRequired,
};

export default AiSmartTable;
