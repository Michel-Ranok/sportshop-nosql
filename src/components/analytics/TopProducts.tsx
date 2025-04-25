// src/components/analytics/TopProducts.tsx
import React from 'react';
import analyticsData from '../../data/analytics.json';

const TopProducts: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Produits les plus vus</h3>
      
      <ul className="space-y-4">
        {analyticsData.productViews.slice(0, 5).map((product, index) => (
          <li key={index} className="flex justify-between items-center">
            <span className="flex-grow">{product.productName}</span>
            <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded">
              {product.views} vues
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopProducts;