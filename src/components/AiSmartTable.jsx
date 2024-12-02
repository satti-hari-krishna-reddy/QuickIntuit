import '../index.css';
import { useState } from 'react';
import Loader from './Loader';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';

const supportedModes = {
    "⭐ Pros and Cons Table": "summerise this textual data into a table of pros and cons",
    "🔑 Key Takeaways": "Summarize the text into a table with two columns: 'Key Point' and 'Details'. Focus on capturing the most important highlights and their explanations.",
    "⚖️ Compare & Contrast": "create a similarities and differences table.",
    "📋 Actionable Insights": "Extract actionable recommendations or next steps from the text in a table format with two columns: 1. Actionable Insight: The specific action or strategy. 2. Reasoning: Why this action is important or relevant.",
    "🔍 Cause-Effect Breakdown": "Identify cause-and-effect relationships from the text and present them in a table with two columns: 1. Cause: The reason or trigger. 2. Effect: The result or consequence.",
    "⚙️ Decision Flow Chart": "Extract decision-making information from the text and create a table with three columns: 1. Decision Point: A key question or decision step. 2. Options: Available choices or paths. 3. Outcome: The result of each choice or path.",
    "❓ Questions & Answers": "Create a table with two columns: 1. Question: A relevant question about the text. 2. Answer: A concise answer based on the content.",
    "📊 Data Analysis Table": "Analyze the following text to extract relevant data points and present them in a structured table. Include columns for numerical values, categories, or key descriptive details mentioned in the text. Focus on factual accuracy, clearly summarizing the data. If no explicit data exists, do not infer but organize available facts logically in tabular format.",
    "📅 Timeline Table": "Please extract the sequence of events mentioned in the text and present them in a timeline table format. The table should have three columns: 'Event', 'Date/Time'. For each event, provide the name or title of the event, the date or time it occurred.",
    "🧠 Relationship Mapping Table": "Analyze the relationships or connections between elements in the text and present them in a table with three columns: 'Element 1', 'Connection/Relation', and 'Element 2'. Include thematic or logical connections where relevant.",
    "📖 Chapter Summary": "Please generate a summary for each chapter or section of the text in a table format. The table should have three columns: 'Chapter Number', 'Chapter Title', and 'Key Points'. For each chapter, provide the chapter number, title, and a brief summary of the main points covered.",
    "😊 Sentiment Analysis": "Analyze the sentiment of the text and create a table with two columns: 1. Text Segment: A specific part of the text. 2. Sentiment: Positive, negative, or neutral.",
};

const AiSmartTable = ({ initialText, clear }) => {
    const [loadingMessage, setLoadingMessage] = useState('Generating the table...');
    const [selectedMode, setSelectedMode] = useState('');
    const [loading, setLoading] = useState(false);
    const [parsedTable, setParsedTable] = useState(null);

    let session = undefined

    const parseMarkdownTable = (markdown) => {
        const rows = markdown.split('\n').filter((row) => row.includes('|'));
        if (rows.length < 2) return null; // Invalid table (needs header + at least one row)

        const headers = rows[0].split('|').map((cell) => cell.trim()).filter(Boolean);
        const dataRows = rows.slice(1).map((row) =>
            row.split('|').map((cell) => cell.trim()).filter(Boolean)
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
        if (!parsedTable) {
            console.log('No table data to render.');
            return null;
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
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {parsedTable.rows.map((row, rowIdx) =>
                            row.every(cell => cell === '---') ? null : ( // Skip divider rows
                                <tr
                                    key={rowIdx}
                                    className="odd:bg-white even:bg-gray-50"
                                >
                                    {row.map((cell, cellIdx) => (
                                        <td
                                            key={cellIdx}
                                            className="px-4 py-2 border border-gray-300"
                                        >
                                            {/* Replace only text between ** with bold */}
                                            {cell.split(/(\*\*.*?\*\*)/g).map((part, i) =>
                                                part.startsWith('**') && part.endsWith('**') ? (
                                                    <strong key={i}>
                                                        {part.slice(2, -2)}
                                                    </strong>
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
                            <div className="max-h-96 overflow-y-auto">
                                {renderTable()}
                            </div>
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

