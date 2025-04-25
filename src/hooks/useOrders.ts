// src/hooks/useOrders.ts
import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/orderService';
import { Order, OrderStatus } from '../types/order';
import { useAuth } from './useAuth';
import { useNotifications } from '../context/NotificationContext';
  import { OrderCreationParams } from '../types/order';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  // Charger les commandes de l'utilisateur
  const loadUserOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const userOrders = await orderService.getUserOrders(user.id);
      setOrders(userOrders);
      setError(null);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Créer une nouvelle commande

const createOrder = useCallback(async (orderData: OrderCreationParams) => {
  if (!user) {
    addNotification('error', 'Vous devez être connecté pour passer une commande');
    return null;
  }
  
  setLoading(true);
  try {
    const newOrder = await orderService.createOrder(orderData, user.id);
    setOrders(prev => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    addNotification('success', 'Commande créée avec succès');
    setError(null);
    return newOrder;
  } catch (err) {
    console.error('Error creating order:', err);
    setError('Erreur lors de la création de la commande');
    addNotification('error', 'Erreur lors de la création de la commande');
    return null;
  } finally {
    setLoading(false);
  }
}, [user, addNotification]);
  
  // Mettre à jour le statut d'une commande
  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    setLoading(true);
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, status);
      
      if (updatedOrder) {
        setOrders(prev => 
          prev.map(order => order.id === orderId ? updatedOrder : order)
        );
        
        if (currentOrder?.id === orderId) {
          setCurrentOrder(updatedOrder);
        }
        
        addNotification('success', `Statut de la commande mis à jour: ${status}`);
        setError(null);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Erreur lors de la mise à jour du statut de la commande');
      addNotification('error', 'Erreur lors de la mise à jour du statut');
    } finally {
      setLoading(false);
    }
  }, [currentOrder, addNotification]);
  
  // Annuler une commande
  const cancelOrder = useCallback(async (orderId: string) => {
    setLoading(true);
    try {
      const cancelledOrder = await orderService.cancelOrder(orderId);
      
      if (cancelledOrder) {
        setOrders(prev => 
          prev.map(order => order.id === orderId ? cancelledOrder : order)
        );
        
        if (currentOrder?.id === orderId) {
          setCurrentOrder(cancelledOrder);
        }
        
        addNotification('info', 'Commande annulée');
        setError(null);
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError('Erreur lors de l\'annulation de la commande');
      addNotification('error', 'Erreur lors de l\'annulation de la commande');
    } finally {
      setLoading(false);
    }
  }, [currentOrder, addNotification]);
  
  // Charger les détails d'une commande
  const loadOrderDetails = useCallback(async (orderId: string) => {
    setLoading(true);
    try {
      const orderDetails = await orderService.getOrderById(orderId);
      
      if (orderDetails) {
        setCurrentOrder(orderDetails);
        setError(null);
      } else {
        setCurrentOrder(null);
        setError('Commande non trouvée');
      }
    } catch (err) {
      console.error('Error loading order details:', err);
      setError('Erreur lors du chargement des détails de la commande');
      setCurrentOrder(null);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Charger les commandes au montage du composant
  useEffect(() => {
    loadUserOrders();
  }, [loadUserOrders]);
  
  return {
    orders,
    currentOrder,
    loading,
    error,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    loadOrderDetails,
    refreshOrders: loadUserOrders
  };
};