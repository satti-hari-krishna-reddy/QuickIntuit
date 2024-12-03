import PropTypes from 'prop-types';

const OverlayButton = ({ onClick }) => {
  return (
    <div>
      <button
        onClick={onClick}
        style={{
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(0, 0, 0, 0.8)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
          fontSize: '22px',
          color: '#8e44ad',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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
