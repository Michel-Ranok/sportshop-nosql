// src/components/catalog/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { FaCartPlus } from 'react-icons/fa';
import AddToCartButton from '../cart/AddToCartButton';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded shadow overflow-hidden h-full flex flex-col">
      <div className="h-48 bg-gray-200 relative">
        {/* Image du produit */}
        <div className="w-full h-full flex items-center justify-center">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400">Image Produit</div>
          )}
        </div>
        
        {/* Badges de stock */}
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            Stock limité
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Rupture de stock
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.category} - {product.sport}</p>
        
        {/* Affichage des étoiles */}
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < Math.round(product.rating) ? '★' : '☆'}</span>
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">{product.rating.toFixed(1)}</span>
        </div>
        
        {/* Description courte */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-2 flex-grow">
          {product.description.substring(0, 100)}
          {product.description.length > 100 ? '...' : ''}
        </p>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="font-bold text-lg">{product.price.toFixed(2)}€</span>
          
          <div className="flex space-x-2">
            <Link 
              to={`/product/${product.id}`}
              className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark transition-colors"
            >
              Voir
            </Link>
            
            <AddToCartButton 
              product={product} 
              className="bg-accent hover:bg-accent-dark text-white px-2 py-1 rounded transition-colors flex items-center"
            >
              <FaCartPlus />
            </AddToCartButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;