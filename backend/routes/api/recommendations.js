const express = require('express');
const router = express.Router();
const { 
  getProductRecommendations, 
  getUserRecommendations, 
  getPopularByCategory,
  getFrequentlyBoughtTogether
} = require('../../utils/inMemoryData');

// Middleware de simulation d'authentification (temporaire)
const simulateAuth = (req, res, next) => {
  req.userId = req.headers['user-id'] || 'u1';
  next();
};

// GET /api/recommendations/products/:productId - Recommandations de produits similaires
router.get('/products/:productId', (req, res) => {
  const productId = req.params.productId;
  const recommendations = getProductRecommendations(productId);
  
  res.json({
    success: true,
    data: recommendations
  });
});

// GET /api/recommendations/user - Recommandations basées sur l'utilisateur
router.get('/user', simulateAuth, (req, res) => {
  const recommendations = getUserRecommendations(req.userId);
  
  res.json({
    success: true,
    data: recommendations
  });
});

// GET /api/recommendations/popular/:category - Produits populaires par catégorie
router.get('/popular/:category', (req, res) => {
  const category = req.params.category;
  const popularProducts = getPopularByCategory(category);
  
  res.json({
    success: true,
    data: popularProducts
  });
});

// GET /api/recommendations/frequently-bought/:productId - Produits fréquemment achetés ensemble
router.get('/frequently-bought/:productId', (req, res) => {
  const productId = req.params.productId;
  const frequentlyBoughtTogether = getFrequentlyBoughtTogether(productId);
  
  res.json({
    success: true,
    data: frequentlyBoughtTogether
  });
});

module.exports = router;