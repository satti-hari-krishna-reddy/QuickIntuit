import PropTypes from 'prop-types';

const Loader = ({ message }) => {
  return (
    <div className="loader flex flex-col items-center justify-center p-6 rounded-lg bg-gray-900 shadow-lg w-full max-w-sm">
      <div className="bar-container flex flex-col space-y-3 w-full">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className={`bar h-4 w-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-bar-${idx}`}
          ></div>
        ))}
      </div>
      <div className="text-sm text-gray-400 mt-6">{message}</div>
      <style>{`
        .animate-bar-0 {
          animation: shimmer 1.5s ease-in-out infinite;
        }
        .animate-bar-1 {
          animation: shimmer 1.5s ease-in-out infinite 0.3s;
        }
        .animate-bar-2 {
          animation: shimmer 1.5s ease-in-out infinite 0.6s;
        }
        @keyframes shimmer {
          0% { transform: scaleX(0.8) translateX(-10%); opacity: 0.8; }
          50% { transform: scaleX(1.1) translateX(10%); opacity: 1; }
          100% { transform: scaleX(0.8) translateX(-10%); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

Loader.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Loader;
