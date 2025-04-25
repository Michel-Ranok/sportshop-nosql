// Stockage temporaire des données en mémoire (sera remplacé par des bases de données NoSQL)
const fs = require('fs');
const path = require('path');

// Chargement des données mockées depuis src/data
const loadMockData = (filename) => {
  try {
    // Chemin relatif vers le dossier src/data
    const filePath = path.join(__dirname, '../../src/data', filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Erreur lors du chargement des données mockées ${filename}:`, error);
    return Array.isArray(filename) ? [] : {};
  }
};

// Données en mémoire
const data = {
  products: loadMockData('products.json'),
  users: loadMockData('users.json'),
  analytics: loadMockData('analytics.json'),
  recommendations: loadMockData('recommendations.json'),
  carts: {},  // Sera remplacé par Redis
  orders: [],  // Sera remplacé par Cassandra
};

// API de manipulation des données
module.exports = {
  // *** Products API (pour MongoDB) ***
  getProducts: (filters = {}) => {
    let filteredProducts = [...data.products];
    
    // Filtrer par catégorie
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === filters.category.toLowerCase() || 
        p.sport.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    // Filtrer par recherche
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
      );
    }
    
    return filteredProducts;
  },
  
  getProductById: (id) => {
    return data.products.find(p => p.id === id);
  },
  
  // *** Cart API (pour Redis) ***
  getCart: (userId) => {
    if (!data.carts[userId]) {
      data.carts[userId] = { 
        id: `cart_${userId}`,
        userId,
        items: [], 
        total: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    return data.carts[userId];
  },
  
  addToCart: (userId, productData, quantity = 1) => {
    // Initialiser le panier si nécessaire
    if (!data.carts[userId]) {
      data.carts[userId] = { 
        id: `cart_${userId}`,
        userId,
        items: [], 
        total: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    const { productId, name, price, imageUrl } = productData;
    
    // Vérifier si le produit est déjà dans le panier
    const existingItemIndex = data.carts[userId].items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex !== -1) {
      // Mettre à jour la quantité si le produit existe déjà
      data.carts[userId].items[existingItemIndex].quantity += quantity;
    } else {
      // Ajouter un nouveau produit
      data.carts[userId].items.push({
        productId,
        name,
        price,
        quantity,
        imageUrl
      });
    }
    
    // Recalculer le total
    data.carts[userId].total = data.carts[userId].items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );
    
    // Mettre à jour la date
    data.carts[userId].updatedAt = new Date().toISOString();
    
    return data.carts[userId];
  },
  
  updateCartItem: (userId, productId, quantity) => {
    if (!data.carts[userId]) return null;
    
    const itemIndex = data.carts[userId].items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) return null;
    
    if (quantity <= 0) {
      // Supprimer l'article
      data.carts[userId].items.splice(itemIndex, 1);
    } else {
      // Mettre à jour la quantité
      data.carts[userId].items[itemIndex].quantity = quantity;
    }
    
    // Recalculer le total
    data.carts[userId].total = data.carts[userId].items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );
    
    // Mettre à jour la date
    data.carts[userId].updatedAt = new Date().toISOString();
    
    return data.carts[userId];
  },
  
  clearCart: (userId) => {
    data.carts[userId] = { 
      id: `cart_${userId}`,
      userId,
      items: [], 
      total: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return data.carts[userId];
  },
  
  // *** Analytics API (pour Cassandra) ***
  getProductViews: () => {
    return data.analytics.productViews;
  },
  
  getSalesByCategory: () => {
    return data.analytics.salesByCategory;
  },
  
  getUserActivity: () => {
    return data.analytics.userActivity;
  },
  
  getSalesByMonth: () => {
    return data.analytics.salesByMonth;
  },
  
  // *** Recommendations API (pour Neo4j) ***
  getProductRecommendations: (productId) => {
    return data.recommendations.productRecommendations[productId] || [];
  },
  
  getUserRecommendations: (userId) => {
    return data.recommendations.userRecommendations[userId] || [];
  },
  
  getPopularByCategory: (category) => {
    return data.recommendations.popularByCategory[category] || [];
  },
  
  getFrequentlyBoughtTogether: (productId) => {
    return data.recommendations.frequentlyBoughtTogether[productId] || [];
  },
  
  // *** Orders API (pour Cassandra) ***
  createOrder: (orderData, userId) => {
    const orderId = `order_${Date.now()}`;
    const newOrder = {
      id: orderId,
      userId,
      items: orderData.items,
      status: 'pending',
      total: orderData.total,
      shippingAddress: orderData.address,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.orders.push(newOrder);
    return newOrder;
  },
  
  getUserOrders: (userId) => {
    return data.orders
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  
  getOrderById: (orderId) => {
    return data.orders.find(order => order.id === orderId) || null;
  },
  
  updateOrderStatus: (orderId, status) => {
    const orderIndex = data.orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return null;
    }
    
    data.orders[orderIndex].status = status;
    data.orders[orderIndex].updatedAt = new Date().toISOString();
    
    return data.orders[orderIndex];
  }
};