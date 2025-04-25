// src/components/recommendations/UserRecommendations.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import recommendationsData from '../../data/recommendations.json';
import { useAuth } from '../../hooks/useAuth';
import { FaCartPlus } from 'react-icons/fa';

const UserRecommendations: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }
  
  const recommendations = recommendationsData.userRecommendations[user.id as keyof typeof recommendationsData.userRecommendations] || [];
  
  if (recommendations.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Recommandé pour vous</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {recommendations.map((product) => (
          <div key={product.productId} className="bg-white border rounded overflow-hidden">
            <div className="h-40 bg-gray-200">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  Image
                </div>
              )}
            </div>
            
            <div className="p-3">
              <h3 className="font-medium text-sm mb-2">{product.name}</h3>
              <div className="flex justify-between items-center">
                <span className="font-bold">{product.price.toFixed(2)}€</span>
                <div className="flex space-x-1">
                  <Link 
                    to={`/product/${product.productId}`}
                    className="bg-primary text-white text-xs px-2 py-1 rounded"
                  >
                    Voir
                  </Link>
                  <button 
                    className="bg-accent text-white text-xs px-2 py-1 rounded"
                    onClick={() => {
                      // Logique d'ajout au panier
                    }}
                  >
                    <FaCartPlus />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRecommendations;