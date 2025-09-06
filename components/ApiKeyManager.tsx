import React, { useState, useEffect } from 'react';

interface ApiKeyManagerProps {
  initialKey: string;
  onSave: (key: string) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ initialKey, onSave }) => {
  const [apiKey, setApiKey] = useState(initialKey);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setApiKey(initialKey);
    // Tự động mở ô chỉnh sửa nếu chưa có key
    if (!initialKey) {
      setIsEditing(true);
    }
  }, [initialKey]);

  const handleSave = () => {
    onSave(apiKey);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <div className="text-sm">
          <p className="font-semibold text-white">Google AI API Key</p>
          <p className="text-gray-400">API Key của bạn được lưu an toàn trên trình duyệt này.</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {isEditing ? (
          <>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Dán API Key của bạn vào đây"
              className="w-full sm:w-64 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            />
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 transition-colors"
            >
              Lưu
            </button>
          </>
        ) : (
          <>
            <span className="text-gray-300 font-mono text-xs">••••••••{apiKey.slice(-4)}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-1.5 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition-colors"
            >
              Chỉnh sửa
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ApiKeyManager;
