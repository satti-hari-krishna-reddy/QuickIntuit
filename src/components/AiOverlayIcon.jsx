import PropTypes from 'prop-types';

const OverlayButton = ({ onClick }) => {
  return (
    <div>
      <button
        onClick={onClick} 
        style={{
          padding: '10px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        +
      </button>
    </div>
  );
};

OverlayButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default OverlayButton;
