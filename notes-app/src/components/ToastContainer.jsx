import { useToast } from '../context/ToastContext';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Toast = ({ id, message, type, removeToast }) => {
  useEffect(() => {
    // Add animation class after mounting
    const timer = setTimeout(() => {
      removeToast(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, removeToast]);

  const getToastClasses = () => {
    const baseClasses = "p-4 mb-3 rounded-md shadow-md flex items-center justify-between max-w-md transition-all duration-500 ease-in-out";
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-100 border-l-4 border-green-500 text-green-700`;
      case 'error':
        return `${baseClasses} bg-red-100 border-l-4 border-red-500 text-red-700`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700`;
      case 'info':
      default:
        return `${baseClasses} bg-blue-100 border-l-4 border-blue-500 text-blue-700`;
    }
  };

  return (
    <div className={getToastClasses()}>
      <div className="flex-1">{message}</div>
      <button
        onClick={() => removeToast(id)}
        className="ml-4 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
    </div>
  );
};

Toast.propTypes = {
  id: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  removeToast: PropTypes.func.isRequired,
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
