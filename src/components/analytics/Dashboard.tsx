// src/components/analytics/Dashboard.tsx
import React from 'react';
import SalesChart from './SalesChart';
import TopProducts from './TopProducts';
import UserActivity from './UserActivity';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Ventes totales</h3>
          <p className="text-3xl font-bold">12 850 €</p>
          <p className="text-sm text-green-500">+12% par rapport au mois dernier</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Commandes</h3>
          <p className="text-3xl font-bold">156</p>
          <p className="text-sm text-green-500">+8% par rapport au mois dernier</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Nouveaux clients</h3>
          <p className="text-3xl font-bold">48</p>
          <p className="text-sm text-green-500">+15% par rapport au mois dernier</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SalesChart />
        <TopProducts />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <UserActivity />
      </div>
    </div>
  );
};

export default Dashboard;