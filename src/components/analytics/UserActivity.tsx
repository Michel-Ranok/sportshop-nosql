// src/components/analytics/UserActivity.tsx
import React from 'react';
import analyticsData from '../../data/analytics.json';

const UserActivity: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Activité des utilisateurs</h3>
      
      <div className="h-64 flex items-end space-x-2">
        {analyticsData.userActivity.map((data, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="bg-accent w-12 rounded-t" 
              style={{ height: `${(data.activeUsers / 200) * 200}px` }}
            ></div>
            <div className="text-xs mt-2">{new Date(data.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserActivity;