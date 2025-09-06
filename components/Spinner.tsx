import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
        <p className="text-gray-400">AI đang tạo nên kiệt tác của bạn...</p>
    </div>
  );
};

export default Spinner;