// src/components/cart/CartItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { CartItem as CartItemType } from '../../types';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center py-4 border-b">
      <div className="w-20 h-20 flex-shrink-0 bg-gray-200 mr-4">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Image
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <Link to={`/product/${item.productId}`} className="font-medium hover:text-primary">
          {item.name}
        </Link>
        <div className="text-gray-500 text-sm">{item.price.toFixed(2)}€</div>
      </div>
      
      <div className="flex items-center mx-4">
        <button 
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          className="bg-gray-200 px-3 py-1 rounded-l"
        >
          -
        </button>
        <span className="bg-gray-100 px-4 py-1">{item.quantity}</span>
        <button 
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          className="bg-gray-200 px-3 py-1 rounded-r"
        >
          +
        </button>
      </div>
      
      <div className="text-right w-24 font-medium">
        {(item.price * item.quantity).toFixed(2)}€
      </div>
      
      <button 
        onClick={() => removeFromCart(item.productId)}
        className="ml-4 text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    </div>
  );
};

export default CartItem;