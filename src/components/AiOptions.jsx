import PropTypes from 'prop-types';

const AiOptions = ({ onOptionSelect }) => {
  const aiOptionsList = [
    { label: "summarize", onClick: () => onOptionSelect("summarize") },
    { label: "rewrite", onClick: () => onOptionSelect("rewrite") },
    { label: "translate", onClick: () => onOptionSelect("translate") },
  ];

  const containerStyle = {
    backgroundColor: 'black',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    padding: '10px',
    position: 'absolute',
    zIndex: 1000,
  };

  const optionStyle = {
    color: 'white',
    margin: '5px 0',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      {aiOptionsList.map((option) => (
        <p
          key={option.label}
          style={optionStyle}
          onClick={option.onClick} 
        >
          {option.label}
        </p>
      ))}
    </div>
  );
}

AiOptions.propTypes = {
  selectedText: PropTypes.string.isRequired,
  onOptionSelect: PropTypes.func.isRequired,
};

export default AiOptions;
