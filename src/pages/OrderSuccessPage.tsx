// src/pages/OrderSuccessPage.tsx
import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { formatDate } from '../utils/formatters';

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { currentOrder, loading, error, loadOrderDetails } = useOrders();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (orderId) {
      loadOrderDetails(orderId);
    }
  }, [orderId, loadOrderDetails]);
  
  // Rediriger vers les commandes si pas d'ID
  useEffect(() => {
    if (!orderId) {
      navigate('/orders');
    }
  }, [orderId, navigate]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (error || !currentOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="text-xl font-bold mb-2">Erreur</h2>
          <p>{error || "Commande non trouvée"}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto">
        <div className="bg-green-100 p-6 border-b">
          <div className="flex items-center justify-center">
            <div className="bg-green-500 text-white rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-800">Commande confirmée</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Merci pour votre commande!</h3>
            <p className="text-gray-600">
              Votre commande a été créée avec succès. Vous recevrez bientôt un e-mail de confirmation.
            </p>
          </div>
          
          <div className="border rounded-md p-4 mb-6 bg-gray-50">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">N° de commande:</span>
              <span className="font-medium">{currentOrder.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Date:</span>
              <span>{formatDate(currentOrder.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Statut:</span>
              <span className="font-medium capitalize">{currentOrder.status}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Produits commandés:</h4>
            <div className="border-t">
              {currentOrder.items.map((item) => (
                <div key={item.productId} className="flex py-4 border-b">
                  <div className="h-16 w-16 flex-shrink-0 bg-gray-200 rounded overflow-hidden mr-4">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{item.name}</h5>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-600">
                        {item.quantity} × {item.price.toFixed(2)}€
                      </span>
                      <span className="font-medium">{(item.quantity * item.price).toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{currentOrder.total.toFixed(2)}€</span>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Link 
              to="/catalog" 
              className="text-primary hover:underline"
            >
              Continuer mes achats
            </Link>
            <Link 
              to="/orders" 
              className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors"
            >
              Voir mes commandes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;