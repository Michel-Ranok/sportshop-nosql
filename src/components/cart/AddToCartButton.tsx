import React, { ReactNode } from 'react';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  children?: ReactNode;
  onAdd?: () => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  product, 
  quantity = 1,
  className = "bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors",
  children
}) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  return (
    <button 
      onClick={handleAddToCart}
      className={className}
      disabled={product.stock <= 0}
    >
      {children || (product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock')}
    </button>
  );
};

export default AddToCartButton;