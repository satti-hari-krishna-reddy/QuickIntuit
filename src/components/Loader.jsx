import PropTypes from 'prop-types';

const Loader = ({ message }) =>{
    return (
        <div className="loader flex flex-col items-center justify-center p-6 rounded-lg bg-gray-800 shadow-md w-full max-w-sm">
            <div className="bar-container flex flex-col space-y-2 w-full">
     
                {[...Array(3)].map((_, idx) => (
                    <div
                        key={idx}
                        className="bar h-3 w-full rounded-lg bg-gradient-to-r from-blue-500 via-green-400 to-purple-600 animate-gradient-shift"
                    ></div>
                ))}
            </div>
            <div className="text-sm text-gray-400 mt-4">{message}</div>
            <style>{`
                .animate-gradient-shift {
                    animation: gradientShift 2s linear infinite;
                    background-size: 200% 200%;
                }
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </div>
    );
}

Loader.propTypes = {
    message: PropTypes.string.isRequired,
};


export default Loader;