// src/types/order.ts
import { CartItem } from './index';

export type OrderStatus = 
  | 'pending'    // Commande créée mais non confirmée
  | 'confirmed'  // Commande confirmée
  | 'shipped'    // Commande expédiée
  | 'delivered'  // Commande livrée
  | 'cancelled'; // Commande annulée

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: Array<OrderItem>;
  status: OrderStatus;
  total: number;
  shippingAddress?: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}



export interface OrderData {
    cart: {
      items: Array<{
        productId: string;
        name: string;
        quantity: number;
        price: number;
      }>;
      total: number;
    };
    address: {
      street: string;
      city: string;
      zip: string;
      country: string;
    };
  }

  export interface OrderCreationParams {
    items: CartItem[];
    total: number;
    address: {
      street: string;
      city: string;
      zip: string;
      country: string;
    };
  }