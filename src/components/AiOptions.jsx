import PropTypes from 'prop-types';
import { MdOutlineSummarize } from 'react-icons/md';
import { AiOutlineRobot } from 'react-icons/ai';
import { FaVolumeUp } from 'react-icons/fa';



import { RiBrushLine } from 'react-icons/ri';
import { RiEdit2Line } from 'react-icons/ri';
import { MdTranslate } from 'react-icons/md';
import { FaTable } from 'react-icons/fa';
import { BsPencilSquare } from 'react-icons/bs';
import '@fontsource/orbitron';

const AiOptions = ({ onOptionSelect, mode }) => {
  let aiOptionsList = [];
  if (mode == 'standalone') {
    aiOptionsList = [
      {
        label: 'Summarize',
        icon: <MdOutlineSummarize />,
        onClick: () => onOptionSelect('summarize'),
      },
      {
        label: 'AI Smart Tables',
        icon: <FaTable />,
        onClick: () => onOptionSelect('ai_table'),
      },
      {
        label: 'Chat with AI',
        icon: <AiOutlineRobot />,
        onClick: () => onOptionSelect('ask_ai'),
      },
      {
        label: 'Write using AI',
        icon: <BsPencilSquare />,
        onClick: () => onOptionSelect('write'),
      },
      {
        label: 'Vocal Mode',
        icon: <FaVolumeUp />,
        onClick: () => onOptionSelect('ask_ai'),
      },
    ];
  } else {
    aiOptionsList = [
      {
        label: 'Summarize',
        icon: <MdOutlineSummarize />,
        onClick: () => {
          console.log('summarize');
          onOptionSelect('summarize') }
      },
      {
        label: 'Polish & Perfect',
        icon: <RiBrushLine />,
        onClick: () => onOptionSelect('write_better'),
      },
      {
        label: 'Ask AI',
        icon: <AiOutlineRobot />,
        onClick: () => onOptionSelect('ask_ai'),
      },
      {
        label: 'AI Smart Tables',
        icon: <FaTable />,
        onClick: () => onOptionSelect('ai_table'),
      },
      {
        label: 'Translate',
        icon: <MdTranslate />,
        onClick: () => onOptionSelect('translate'),
      },
      {
        label: 'Write using AI',
        icon: <BsPencilSquare />,
        onClick: () => onOptionSelect('write'),
      },
      {
        label: 'Rewrite using AI',
        icon: <RiEdit2Line />,
        onClick: () => onOptionSelect('rewrite'),
      },
    ];
  }

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
            style={{
              ...optionStyle,
              backgroundColor: index % 2 === 0 ? '#2c2c2e' : 'transparent',
            }}
            onClick={option.onClick}
          >
            <div style={iconStyle}>{option.icon}</div>
            <span>{option.label}</span>
          </div>
          {index < aiOptionsList.length - 1 && (
            <div style={separatorStyle}></div>
          )}
        </div>
      ))}
    </div>
  );
};

AiOptions.propTypes = {
  onOptionSelect: PropTypes.func.isRequired,
};
AiOptions.propTypes = {
  mode: PropTypes.string.isRequired,
};
export default AiOptions;
