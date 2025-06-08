import './ActionButton.css';
import PropTypes from 'prop-types';

const ActionButton = ({ icon, type = 'primary', onClick, ariaLabel }) => {
  return (
    <button
      className={`action-button ${type}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
};

ActionButton.propTypes = {
  icon: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  onClick: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string.isRequired,
};

export default ActionButton;
