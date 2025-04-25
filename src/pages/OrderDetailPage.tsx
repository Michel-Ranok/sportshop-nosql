// src/pages/OrderDetailPage.tsx
import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/formatters';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { currentOrder, loading, error, loadOrderDetails, cancelOrder } = useOrders();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Rediriger si non authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=orders');
    }
  }, [isAuthenticated, navigate]);
  
  // Charger les détails de la commande
  useEffect(() => {
    if (orderId) {
      loadOrderDetails(orderId);
    }
  }, [orderId, loadOrderDetails]);
  
  // Gérer le statut visuel des commandes
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">En attente</span>;
      case 'confirmed':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Confirmée</span>;
      case 'shipped':
        return <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">Expédiée</span>;
      case 'delivered':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Livrée</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full">Annulée</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };
  
  // Gérer l'annulation d'une commande
  const handleCancelOrder = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      await cancelOrder(orderId || '');
    }
  };
  
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
        <div className="flex items-center mb-6">
          <Link to="/orders" className="text-primary hover:underline mr-4">
            ← Retour aux commandes
          </Link>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="text-xl font-bold mb-2">Erreur</h2>
          <p>{error || "Commande non trouvée"}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/orders" className="text-primary hover:underline mr-4">
          ← Retour aux commandes
        </Link>
        <h1 className="text-2xl font-bold">Détail de la commande #{currentOrder.id.slice(0, 8).toUpperCase()}</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6 border-b">
          <div className="flex flex-wrap justify-between mb-4">
            <div className="mb-4 md:mb-0">
              <h2 className="text-sm font-medium text-gray-500">Date de commande</h2>
              <p className="mt-1">{formatDate(currentOrder.createdAt)}</p>
            </div>
            <div className="mb-4 md:mb-0">
              <h2 className="text-sm font-medium text-gray-500">Statut</h2>
              <div className="mt-1">{getStatusBadge(currentOrder.status)}</div>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Total</h2>
              <p className="mt-1 font-semibold">{currentOrder.total.toFixed(2)}€</p>
            </div>
          </div>
          
          {currentOrder.status === 'pending' && (
            <div className="mt-4">
              <button
                onClick={handleCancelOrder}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Annuler la commande
              </button>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Produits commandés</h2>
          <div className="border rounded-md overflow-hidden">
            {currentOrder.items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className={`flex p-4 ${index < currentOrder.items.length - 1 ? 'border-b' : ''}`}>
                <div className="h-20 w-20 flex-shrink-0 bg-gray-200 rounded overflow-hidden mr-4">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      Image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Link to={`/product/${item.productId}`} className="font-medium hover:text-primary">
                    {item.name}
                  </Link>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600">
                      Quantité: {item.quantity}
                    </span>
                    <span className="font-medium">
                      {(item.price * item.quantity).toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {currentOrder.shippingAddress && (
          <div className="p-6 border-t">
            <h2 className="text-lg font-semibold mb-4">Adresse de livraison</h2>
            <div className="bg-gray-50 p-4 rounded">
              <p>{currentOrder.shippingAddress.street}</p>
              <p>{currentOrder.shippingAddress.zip} {currentOrder.shippingAddress.city}</p>
              <p>{currentOrder.shippingAddress.country}</p>
            </div>
          </div>
        )}
        
        <div className="p-6 border-t">
          <h2 className="text-lg font-semibold mb-4">Récapitulatif</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Sous-total:</span>
              <span>{currentOrder.total.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de livraison:</span>
              <span>Gratuit</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total:</span>
              <span>{currentOrder.total.toFixed(2)}€</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;