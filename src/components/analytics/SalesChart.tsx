// src/components/analytics/SalesChart.tsx
import React from 'react';
import analyticsData from '../../data/analytics.json';

const SalesChart: React.FC = () => {
  // Dans une application réelle, utilisez une bibliothèque de graphiques comme Recharts
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Ventes par mois</h3>
      
      <div className="h-64 flex items-end space-x-2">
        {analyticsData.salesByMonth.map((data, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="bg-primary w-12 rounded-t" 
              style={{ height: `${(data.sales / 15000) * 200}px` }}
            ></div>
            <div className="text-xs mt-2">{data.month}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesChart;