// src/services/orderService.ts
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderStatus, OrderCreationParams } from '../types/order';

// Simuler une base de données en utilisant localStorage
const getOrdersFromStorage = (): Order[] => {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
};

const saveOrdersToStorage = (orders: Order[]) => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

// Service pour gérer les commandes
export const orderService = {
  // Créer une nouvelle commande
  createOrder: async (orderData: OrderCreationParams, userId: string): Promise<Order> => {
    if (!orderData.items.length) {
      throw new Error('Le panier est vide');
    }
    
    const newOrder: Order = {
      id: uuidv4(),
      userId,
      items: orderData.items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl
      })),
      status: 'pending',
      total: orderData.total,
      shippingAddress: orderData.address,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Sauvegarder la commande
    const orders = getOrdersFromStorage();
    orders.push(newOrder);
    saveOrdersToStorage(orders);
    
    return newOrder;
  },
  
  // Récupérer toutes les commandes d'un utilisateur
  getUserOrders: async (userId: string): Promise<Order[]> => {
    const orders = getOrdersFromStorage();
    return orders
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  
  // Récupérer une commande par son ID
  getOrderById: async (orderId: string): Promise<Order | null> => {
    const orders = getOrdersFromStorage();
    return orders.find(order => order.id === orderId) || null;
  },
  
  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order | null> => {
    const orders = getOrdersFromStorage();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return null;
    }
    
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    saveOrdersToStorage(orders);
    return orders[orderIndex];
  },
  
  // Annuler une commande
  cancelOrder: async (orderId: string): Promise<Order | null> => {
    return orderService.updateOrderStatus(orderId, 'cancelled');
  }
};