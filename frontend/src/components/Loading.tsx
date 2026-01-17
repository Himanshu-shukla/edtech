import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-deep">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-edtech-green mb-4"></div>
        <p className="text-white/80 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;