import { useState, useEffect } from 'react';
import Loader from './Loader';
import PropTypes from 'prop-types';

function injectTailwindStyles() {
    const tailwindLink = document.createElement('link');
    tailwindLink.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    tailwindLink.rel = 'stylesheet';
    document.head.appendChild(tailwindLink);
}

// Supported modes (no changes to this part)
const supportedModes = {
    "⭐ Pros and Cons Table": "summerise this textual data into a table of pros and cons",
    "🔑 Key Takeaways": "Create a side-by-side layout with key takeaways and explanations.",
    "⚖️ Compare & Contrast": "Highlight similarities and differences side by side table.",
};

const AiSmartTable = ({ initialText, clear }) => {
    const [loadingMessage, setLoadingMessage] = useState('Generating the table...');
    const [selectedMode, setSelectedMode] = useState('');
    const [loading, setLoading] = useState(false);
    const [parsedTable, setParsedTable] = useState(null);

    useEffect(() => {
        injectTailwindStyles();
    }, []);

    // Fixed Markdown Table Parsing
    const parseMarkdownTable = (markdown) => {
        const rows = markdown.split('\n').filter((row) => row.includes('|'));
        if (rows.length < 2) return null; // Invalid table (needs header + at least one row)

        const headers = rows[0].split('|').map((cell) => cell.trim()).filter(Boolean);
        const dataRows = rows.slice(1).map((row) =>
            row.split('|').map((cell) => cell.trim()).filter(Boolean)
        );

        return { headers, rows: dataRows };
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
                const session = await ai.languageModel.create({
                    temperature : 0.5,
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
        if (!parsedTable) return null;
    
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
        <div
            className="relative container mx-auto p-4 max-w-xl rounded-lg shadow-lg bg-gray-50"
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
                            onClick={clear}
                        >
                            X
                        </button>
                    </div>

                    {parsedTable ? (
                        <div>
                            {renderTable()}
                            <button
                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 mt-4 rounded-md w-full transition duration-200"
                                onClick={() => setParsedTable(null)}
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
    );
};

AiSmartTable.propTypes = {
    initialText: PropTypes.string.isRequired,
    clear: PropTypes.func.isRequired,
};

export default AiSmartTable;
