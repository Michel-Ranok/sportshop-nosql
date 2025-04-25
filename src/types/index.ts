// Types pour les produits
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    sport: string;
    imageUrl: string;
    stock: number;
    rating: number;
    reviews: Review[];
    relatedProducts?: string[];
  }
  
  // Types pour les avis
  export interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }
  
  // Types pour le panier
  export interface CartItem {
    productId: string;
    quantity: number;
    name: string;
    price: number;
    imageUrl: string;
  }
  
  export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    createdAt: Date;
    updatedAt: Date;
    address?: {
      street: string;
      city: string;
      zip: string;
      country: string;
    };
  }
  
  // Types pour les utilisateurs
  export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    password?: string; // Optionnel pour les utilisateurs non administrateurs
    createdAt: string;
  }
  
  // Types pour les analyses
  export interface AnalyticsData {
    productViews: {
      productId: string;
      productName: string;
      views: number;
    }[];
    salesByCategory: {
      category: string;
      sales: number;
    }[];
    userActivity: {
      date: string;
      activeUsers: number;
    }[];
  }
  
  // Types pour les recommandations
  export interface Recommendation {
    productId: string;
    name: string;
    imageUrl: string;
    price: number;
    score: number;
  }

  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }

  export interface ProductListProps {
    filters: {
      categories: string[];
      sports: string[];
      priceRange: [number, number];
    };
  }