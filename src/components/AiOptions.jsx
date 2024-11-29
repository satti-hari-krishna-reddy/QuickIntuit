import PropTypes from "prop-types";
import { MdOutlineSummarize } from "react-icons/md"; // Summarize
import { AiOutlineRobot } from "react-icons/ai"; // Ask AI
import { RiBrushLine } from "react-icons/ri";
import { RiEdit2Line } from "react-icons/ri";
import { MdTranslate } from "react-icons/md"; // Translate
import { FaTable } from "react-icons/fa"; // AI Smart Tables
import { BsPencilSquare } from "react-icons/bs"; // Write using AI
import "@fontsource/orbitron"; // Orbitron font for a futuristic look


const AiOptions = ({ onOptionSelect }) => {
  const aiOptionsList = [
    { label: "Summarize", icon: <MdOutlineSummarize />, onClick: () => onOptionSelect("summarize") },
    { label: "Polish & Perfect", icon: <RiBrushLine />, onClick: () => onOptionSelect("write_better") },
    { label: "Ask AI", icon: <AiOutlineRobot />, onClick: () => onOptionSelect("ask_ai") },
    { label: "AI Smart Tables", icon: <FaTable />, onClick: () => onOptionSelect("ai_table") },
    { label: "Translate", icon: <MdTranslate />, onClick: () => onOptionSelect("translate") },
    { label: "Write using AI", icon: <BsPencilSquare />, onClick: () => onOptionSelect("write") },
    { label: "Rewrite using AI", icon: <RiEdit2Line />, onClick: () => onOptionSelect("rewrite") },
  ];

  const containerStyle = {
    backgroundColor: '#1c1c1e',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
    padding: '15px',
    position: 'absolute',
    zIndex: 1000,
    width: '200px',
    fontFamily: 'Orbitron, sans-serif',
  };

  const optionStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#e0e0e0',
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background-color 0.3s',
  };

  const iconStyle = {
    width: '20px',
    height: '20px',
    marginRight: '10px',
  };

  const separatorStyle = {
    height: '1px',
    backgroundColor: '#333',
    margin: '5px 0',
  };

  return (
    <div style={containerStyle}>
      {aiOptionsList.map((option, index) => (
        <div key={option.label}>
          <div
            style={{ ...optionStyle, backgroundColor: index % 2 === 0 ? '#2c2c2e' : 'transparent' }}
            onClick={option.onClick}
          >
           <div style={iconStyle}>
               {option.icon}
            </div>
            <span>{option.label}</span>
          </div>
          {index < aiOptionsList.length - 1 && <div style={separatorStyle}></div>}
        </div>
      ))}
    </div>
  );
};

AiOptions.propTypes = {
  onOptionSelect: PropTypes.func.isRequired,
};

export default AiOptions;
