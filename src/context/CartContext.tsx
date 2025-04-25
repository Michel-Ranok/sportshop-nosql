import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Cart, Product } from '../types/index';


// Valeur initiale du panier vide
const initialCart: Cart = {
  id: '',
  userId: '',
  items: [],
  total: 0,
  createdAt: new Date(),
  updatedAt: new Date()
};

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(() => {
    // Récupérer le panier depuis localStorage si disponible
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : initialCart;
  });

  // Sauvegarder le panier dans localStorage à chaque mise à jour
  const saveCart = (newCart: Cart) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const updatedCart = { ...cart };
    const existingItemIndex = updatedCart.items.findIndex(item => item.productId === product.id);

    if (existingItemIndex >= 0) {
      // Mettre à jour la quantité si le produit existe déjà
      updatedCart.items[existingItemIndex].quantity += quantity;
    } else {
      // Ajouter le nouveau produit
      updatedCart.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl
      });
    }

    // Recalculer le total
    updatedCart.total = updatedCart.items.reduce(
      (sum, item) => sum + item.price * item.quantity, 
      0
    );
    updatedCart.updatedAt = new Date();

    saveCart(updatedCart);
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = { ...cart };
    updatedCart.items = updatedCart.items.filter(item => item.productId !== productId);
    
    // Recalculer le total
    updatedCart.total = updatedCart.items.reduce(
      (sum, item) => sum + item.price * item.quantity, 
      0
    );
    updatedCart.updatedAt = new Date();

    saveCart(updatedCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = { ...cart };
    const itemIndex = updatedCart.items.findIndex(item => item.productId === productId);
    
    if (itemIndex >= 0) {
      updatedCart.items[itemIndex].quantity = quantity;
      
      // Recalculer le total
      updatedCart.total = updatedCart.items.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
      );
      updatedCart.updatedAt = new Date();

      saveCart(updatedCart);
    }
  };

  const clearCart = () => {
    saveCart({
      ...initialCart,
      updatedAt: new Date()
    });
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personnalisé pour utiliser le context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};