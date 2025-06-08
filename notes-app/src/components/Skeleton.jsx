import React from 'react';

export const SkeletonText = ({ lines = 1, width = '100%' }) => {
  return (
    <div className="skeleton-container">
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="skeleton-text"
          style={{
            width: typeof width === 'string' ? width : `${width[i % width.length]}%`
          }}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card-title" />
      <div className="skeleton-card-content">
        <div className="skeleton-card-line" style={{ width: '90%' }} />
        <div className="skeleton-card-line" style={{ width: '80%' }} />
        <div className="skeleton-card-line" style={{ width: '60%' }} />
      </div>
      <div className="skeleton-card-footer" />
    </div>
  );
};

// Add a default export that can act as a general Skeleton component
const Skeleton = ({ type, ...props }) => {
  switch (type) {
    case 'text':
      return <SkeletonText {...props} />;
    case 'card':
    case 'note': // Assuming 'note' type should render a card
      return <SkeletonCard {...props} />;
    default:
      return <div className="skeleton-element">Loading...</div>; // Fallback
  }
};

export default Skeleton;
