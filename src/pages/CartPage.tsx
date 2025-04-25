import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';

// Simuler un service Redis pour les sessions
const sessionService = {
  getLastOrder: () => {
    return JSON.parse(localStorage.getItem('lastOrder') || 'null');
  },
  setLastOrder: (order: { items: { productId: string; name: string; price: number; quantity: number; imageUrl?: string }[]; total: number; date: string }) => {
    localStorage.setItem('lastOrder', JSON.stringify(order));
  }
};

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { addNotification } = useNotifications();
  const [lastOrder, setLastOrder] = useState<{
    items: { productId: string; name: string; price: number; quantity: number; imageUrl?: string }[];
    total: number;
    date: string;
  } | null>(null);
  
  // Récupérer la dernière commande depuis Redis (simulé)
  useEffect(() => {
    const fetchLastOrder = async () => {
      try {
        // Dans l'implémentation réelle, ceci appellerait Redis
        const order = sessionService.getLastOrder();
        setLastOrder(order);
      } catch (error) {
        console.error('Error fetching last order:', error);
      }
    };
    
    fetchLastOrder();
  }, []);
  
  const handleCheckout = () => {
    if (cart.items.length === 0) {
      addNotification('error', 'Votre panier est vide');
      return;
    }
    
    // Simuler un checkout
    const orderInfo = {
      items: cart.items,
      total: cart.total,
      date: new Date().toISOString()
    };
    
    // Sauvegarder dans Redis (simulé)
    sessionService.setLastOrder(orderInfo);
    setLastOrder(orderInfo);
    
    addNotification('success', 'Commande effectuée avec succès!');
    clearCart();
  };
  
  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Votre panier</h1>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 mb-4">Votre panier est vide</p>
          <Link to="/catalog" className="btn-primary inline-block">
            Continuer vos achats
          </Link>
          
          {lastOrder && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-semibold text-blue-800">Votre dernière commande</h3>
              <p className="text-sm text-blue-600 mt-1">
                Passée le {new Date(lastOrder.date).toLocaleDateString()} pour un montant de {lastOrder.total.toFixed(2)}€
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Votre panier</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cart.items.map(item => (
                  <tr key={item.productId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            src={item.imageUrl || '/assets/placeholder.jpg'} 
                            alt={item.name}
                            className="h-10 w-10 object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="bg-gray-200 px-2 py-1 rounded-l"
                        >
                          -
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="bg-gray-200 px-2 py-1 rounded-r"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {item.price.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {(item.price * item.quantity).toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between">
            <Link to="/catalog" className="text-primary hover:text-primary-dark">
              ← Continuer vos achats
            </Link>
            <button 
              onClick={clearCart}
              className="text-red-600 hover:text-red-900"
            >
              Vider le panier
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Récapitulatif</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{cart.total.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de livraison</span>
              <span>Gratuit</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>{cart.total.toFixed(2)} €</span>
            </div>
          </div>
          
          <button 
            className="w-full mt-6 btn-primary py-3"
            onClick={handleCheckout}
          >
            Procéder au paiement
          </button>
          
          {lastOrder && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-semibold text-blue-800">Votre dernière commande</h3>
              <p className="text-sm text-blue-600 mt-1">
                Passée le {new Date(lastOrder.date).toLocaleDateString()} pour un montant de {lastOrder.total.toFixed(2)}€
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;