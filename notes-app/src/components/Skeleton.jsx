import PropTypes from 'prop-types';

const Skeleton = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="flex space-x-2">
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
          </div>
        );
      case 'avatar':
        return (
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
};

Skeleton.propTypes = {
  type: PropTypes.oneOf(['card', 'text', 'avatar']),
  count: PropTypes.number,
};

export default Skeleton;
