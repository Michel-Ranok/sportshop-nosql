const express = require('express');
const router = express.Router();

// Route de test pour vérifier que l'API fonctionne
router.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'L\'API SportShop est opérationnelle',
    timestamp: new Date()
  });
});

// Routes API
router.use('/products', require('./api/products'));
router.use('/cart', require('./api/cart'));
router.use('/analytics', require('./api/analytics'));
router.use('/recommendations', require('./api/recommendations'));
router.use('/orders', require('./api/orders'));

// Gestion des routes non trouvées
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ressource non trouvée'
  });
});

module.exports = router;