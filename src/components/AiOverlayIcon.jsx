import PropTypes from 'prop-types';

const OverlayButton = ({ onClick }) => {
  return (
    <div>
      <button
        onClick={onClick}
        style={{
          width: '45px', // Sleeker size
          height: '45px',
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.7)', // Darker, more opaque background
          backdropFilter: 'blur(15px)', // Stronger frosted glass effect
          border: '1px solid rgba(0, 0, 0, 0.8)', // Darker border to match
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)', // Darker shadow for more elevation
          fontSize: '22px', // Balanced icon size
          color: '#8e44ad', // Luxurious purple for AI vibe
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease', // Animation for interactivity
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.4)';
        }}
      >
        ✨
      </button>
    </div>
  );
};

OverlayButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default OverlayButton;
