/* eslint-disable no-unused-vars */
import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  Clock, 
  Circle,
  User,
  Users
} from 'lucide-react';

const UserPresenceIndicator = ({ 
  users = [], 
  currentUser, 
  showDetails = false,
  maxVisible = 5 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-blue-400 border-blue-300';
      case 'away':
        return 'bg-yellow-400 border-yellow-300';
      case 'busy':
        return 'bg-red-400 border-red-300';
      case 'offline':
        return 'bg-gray-400 border-gray-300';
      default:
        return 'bg-blue-400 border-blue-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-3 h-3" />;
      case 'away':
        return <Clock className="w-3 h-3" />;
      case 'busy':
        return <Circle className="w-3 h-3" />;
      case 'offline':
        return <WifiOff className="w-3 h-3" />;
      default:
        return <Wifi className="w-3 h-3" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'busy':
        return 'Busy';
      case 'offline':
        return 'Offline';
      default:
        return 'Online';
    }
  };

  const getLastSeenText = (lastActivity) => {
    if (!lastActivity) return 'Just now';
    
    const now = Date.now();
    const diff = now - lastActivity;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const onlineUsers = users.filter(user => user.status === 'online' || !user.status);
  const awayUsers = users.filter(user => user.status === 'away');
  const busyUsers = users.filter(user => user.status === 'busy');
  const offlineUsers = users.filter(user => user.status === 'offline');

  if (showDetails) {
    return (
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 rounded-xl border border-gray-600/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-400" />
            Room Members ({users.length})
          </h3>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-blue-400">{onlineUsers.length}</span>
            </div>
            {awayUsers.length > 0 && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-yellow-400">{awayUsers.length}</span>
              </div>
            )}
            {busyUsers.length > 0 && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-red-400">{busyUsers.length}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div 
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(user.status || 'online')}`}
                  ></div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{user.name}</span>
                    {user.id === currentUser?._id && (
                      <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full">You</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    {getStatusIcon(user.status || 'online')}
                    <span>{getStatusText(user.status || 'online')}</span>
                    {user.status !== 'online' && (
                      <span>• {getLastSeenText(user.lastActivity)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Compact view
  return (
    <div className="flex items-center space-x-2">
      <div className="flex -space-x-2">
        {users.slice(0, maxVisible).map((user) => (
          <div key={user.id} className="relative group">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full flex items-center justify-center border-2 border-gray-800 text-white text-sm font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div 
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(user.status || 'online')}`}
            ></div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
              {user.name} - {getStatusText(user.status || 'online')}
              {user.status !== 'online' && (
                <div className="text-gray-400">
                  Last seen: {getLastSeenText(user.lastActivity)}
                </div>
              )}
            </div>
          </div>
        ))}
        {users.length > maxVisible && (
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center border-2 border-gray-800 text-white text-xs">
            +{users.length - maxVisible}
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-400">
        {onlineUsers.length} online
        {awayUsers.length > 0 && `, ${awayUsers.length} away`}
      </div>
    </div>
  );
};

export default UserPresenceIndicator;