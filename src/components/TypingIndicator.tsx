import React from 'react';

export const TypingIndicator: React.FC = () => (
  <div className="flex gap-4 p-6 bg-gray-900">
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
    </div>
  </div>
);