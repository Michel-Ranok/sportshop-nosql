// src/components/common/NotificationDisplay.tsx
import React from 'react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationDisplay: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-72">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`p-4 rounded-md shadow-md flex items-start justify-between ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' :
            notification.type === 'error' ? 'bg-red-100 text-red-800' :
            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}
        >
          <p className="flex-1">{notification.message}</p>
          <button 
            onClick={() => removeNotification(notification.id)}
            className="ml-4 text-sm opacity-75 hover:opacity-100"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationDisplay;