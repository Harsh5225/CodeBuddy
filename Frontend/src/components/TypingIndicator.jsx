import React from 'react';
import { MessageSquare } from 'lucide-react';

const TypingIndicator = ({ typingUsers, currentUser }) => {
  if (!typingUsers || typingUsers.size === 0) return null;

  const typingArray = Array.from(typingUsers).filter(name => name !== currentUser?.firstName);
  
  if (typingArray.length === 0) return null;

  const getTypingText = () => {
    if (typingArray.length === 1) {
      return `${typingArray[0]} is typing...`;
    } else if (typingArray.length === 2) {
      return `${typingArray[0]} and ${typingArray[1]} are typing...`;
    } else if (typingArray.length === 3) {
      return `${typingArray[0]}, ${typingArray[1]} and ${typingArray[2]} are typing...`;
    } else {
      return `${typingArray[0]}, ${typingArray[1]} and ${typingArray.length - 2} others are typing...`;
    }
  };

  return (
    <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/30 border-t border-gray-700/30">
      <div className="flex items-center space-x-2">
        <MessageSquare className="w-4 h-4 text-blue-400" />
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div 
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" 
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div 
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" 
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
      <span className="text-sm text-gray-400 italic">
        {getTypingText()}
      </span>
    </div>
  );
};

export default TypingIndicator;