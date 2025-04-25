const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, clearCart, getProductById } = require('../../utils/inMemoryData');

// Middleware de simulation d'authentification (temporaire)
const simulateAuth = (req, res, next) => {
  // Pour les tests, on utilise un userId fixe
  req.userId = req.headers['user-id'] || 'u1';
  next();
};

// Appliquer le middleware sur toutes les routes du panier
router.use(simulateAuth);

// GET /api/cart - Récupérer le panier de l'utilisateur
router.get('/', (req, res) => {
  const cart = getCart(req.userId);
  res.json({
    success: true,
    data: cart
  });
});

// POST /api/cart/add - Ajouter un produit au panier
router.post('/add', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  if (!productId) {
    return res.status(400).json({
      success: false,
      message: 'ID du produit requis'
    });
  }
  
  // Trouver le produit pour récupérer ses détails
  const product = getProductById(productId);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Produit non trouvé'
    });
  }
  
  const productData = {
    productId: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl
  };
  
  const cart = addToCart(req.userId, productData, quantity);
  
  res.json({
    success: true,
    message: 'Produit ajouté au panier',
    data: cart
  });
});

// PUT /api/cart/update - Mettre à jour la quantité d'un produit
router.put('/update', (req, res) => {
  const { productId, quantity } = req.body;
  
  if (!productId || quantity === undefined) {
    return res.status(400).json({
      success: false,
      message: 'ID du produit et quantité requis'
    });
  }
  
  const cart = updateCartItem(req.userId, productId, quantity);
  
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Produit non trouvé dans le panier'
    });
  }
  
  res.json({
    success: true,
    message: 'Panier mis à jour',
    data: cart
  });
});

// DELETE /api/cart/clear - Vider le panier
router.delete('/clear', (req, res) => {
  const cart = clearCart(req.userId);
  
  res.json({
    success: true,
    message: 'Panier vidé',
    data: cart
  });
});

module.exports = router;