import productsData from '../data/products.json';
import analyticsData from '../data/analytics.json';
import { Product, Recommendation } from '../types';

// Pour simuler des délais d'API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Service API pour les produits
export const productService = {
  getAll: async (): Promise<Product[]> => {
    await delay(500); // Simule le délai réseau
    return productsData;
  },
  
  getById: async (id: string): Promise<Product | undefined> => {
    await delay(300);
    return productsData.find(product => product.id === id);
  },
  
  getByCategory: async (category: string): Promise<Product[]> => {
    await delay(500);
    return productsData.filter(product => 
      product.category.toLowerCase() === category.toLowerCase() || 
      product.sport.toLowerCase() === category.toLowerCase()
    );
  },
  
  search: async (query: string): Promise<Product[]> => {
    await delay(700);
    const searchTerm = query.toLowerCase();
    return productsData.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm)
    );
  }
};

// Service pour le panier (utilisant localStorage pour persister les données)
export const cartService = {
  getCart: () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : { items: [], total: 0 };
  },
  
  addToCart: (product: Product, quantity: number = 1) => {
    const cart = cartService.getCart();
    
    // Vérifier si le produit est déjà dans le panier
    const existingItemIndex = cart.items.findIndex((item: { productId: string; quantity: number; price: number }) => item.productId === product.id);
    
    if (existingItemIndex !== -1) {
      // Mettre à jour la quantité si le produit existe déjà
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Ajouter un nouveau produit
      cart.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity
      });
    }
    
    // Recalculer le total
    cart.total = cart.items.reduce((sum: number, item: { productId: string; name: string; price: number; imageUrl: string; quantity: number }) => sum + (item.price * item.quantity), 0);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    return cart;
  },
  
  updateQuantity: (productId: string, quantity: number) => {
    const cart = cartService.getCart();
    
    const existingItemIndex = cart.items.findIndex((item: { productId: string; quantity: number; price: number }) => item.productId === productId);
    
    if (existingItemIndex !== -1) {
      if (quantity <= 0) {
        // Supprimer l'article si la quantité est 0 ou négative
        cart.items.splice(existingItemIndex, 1);
      } else {
        // Mettre à jour la quantité
        cart.items[existingItemIndex].quantity = quantity;
      }
      
      // Recalculer le total
      cart.total = cart.items.reduce((sum: number, item: { productId: string; name: string; price: number; imageUrl: string; quantity: number }) => sum + (item.price * item.quantity), 0);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    return cart;
  },
  
  clearCart: () => {
    localStorage.removeItem('cart');
    return { items: [], total: 0 };
  }
};

// Service pour les analytics
export const analyticsService = {
  getProductViews: async () => {
    await delay(800);
    return analyticsData.productViews;
  },
  
  getSalesByCategory: async () => {
    await delay(700);
    return analyticsData.salesByCategory;
  },
  
  getUserActivity: async () => {
    await delay(600);
    return analyticsData.userActivity;
  },
  
  getSalesByMonth: async () => {
    await delay(500);
    return analyticsData.salesByMonth;
  }
};

// Service pour les recommandations de produits
export const recommendationService = {
  getRecommendations: async (productId: string): Promise<Recommendation[]> => {
    await delay(600);
    
    // Trouver le produit actuel
    const currentProduct = productsData.find(p => p.id === productId);
    
    if (!currentProduct || !currentProduct.relatedProducts) {
      return [];
    }
    
    // Obtenir les produits liés
    const recommendations = currentProduct.relatedProducts
      .map(id => {
        const product = productsData.find(p => p.id === id);
        if (!product) return null;
        
        return {
          productId: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          score: Math.random() * 0.5 + 0.5 // Score aléatoire entre 0.5 et 1
        };
      })
      .filter(Boolean) as Recommendation[];
    
    return recommendations.sort((a, b) => b.score - a.score);
  },
  
  getUserBasedRecommendations: async (): Promise<Recommendation[]> => {
    await delay(800);
    
    // Simuler des recommandations basées sur l'utilisateur
    return productsData
      .slice(0, 4)
      .map(product => ({
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        score: Math.random() * 0.5 + 0.5
      }))
      .sort((a, b) => b.score - a.score);
  }
};