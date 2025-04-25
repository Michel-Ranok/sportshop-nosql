// src/pages/CheckoutPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../context/NotificationContext';

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    zip: '',
    country: 'France'
  });
  
  const [loading, setLoading] = useState(false);
  
  // Manipulation des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Soumission de la commande
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      addNotification('error', 'Vous devez être connecté pour passer une commande');
      navigate('/login?redirect=checkout');
      return;
    }
    
    if (cart.items.length === 0) {
      addNotification('error', 'Votre panier est vide');
      return;
    }
    
    // Vérification des champs du formulaire
    if (!formData.street || !formData.city || !formData.zip) {
      addNotification('error', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setLoading(true);
    
    try {
      // Créer la commande avec adresse de livraison
      const orderData = {
        id: cart.id,
        userId: user?.id || '',
        items: cart.items,
        total: cart.total,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
        address: {
          street: formData.street,
          city: formData.city,
          zip: formData.zip,
          country: formData.country
        }
      };
      
      const order = await createOrder(orderData);
      
      if (order) {
        // Vider le panier après commande réussie
        clearCart();
        
        // Rediriger vers la page de succès
        navigate(`/orders/success/${order.id}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      addNotification('error', 'Une erreur est survenue lors de la validation de la commande');
    } finally {
      setLoading(false);
    }
  };
  
  // Si le panier est vide, rediriger vers la page du panier
  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
          <p className="mb-4">Vous ne pouvez pas passer de commande avec un panier vide.</p>
          <button
            onClick={() => navigate('/catalog')}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Parcourir le catalogue
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Finaliser votre commande</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Adresse de livraison</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="street">
                  Adresse*
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="city">
                    Ville*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="zip">
                    Code postal*
                  </label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="country">
                  Pays*
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-4 py-2 px-4 rounded ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                {loading ? 'Traitement en cours...' : 'Confirmer la commande'}
              </button>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
            
            <div className="border-b pb-4 mb-4">
              {cart.items.map(item => (
                <div key={item.productId} className="flex justify-between mb-2">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 text-sm block">
                      {item.quantity} × {item.price.toFixed(2)}€
                    </span>
                  </div>
                  <span>{(item.price * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{cart.total.toFixed(2)}€</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;