// src/components/recommendations/SimilarProducts.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCartPlus } from 'react-icons/fa';
import { Recommendation } from '@/types';

interface SimilarProductsProps {
  recommendations: Recommendation[];
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ recommendations }) => {
  if (recommendations.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {recommendations.map((product) => (
        <div key={product.productId} className="bg-white rounded shadow overflow-hidden">
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
          
          <div className="p-4">
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
  );
};

export default SimilarProducts;