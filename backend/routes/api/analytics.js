const express = require('express');
const router = express.Router();
const { 
  getProductViews, 
  getSalesByCategory, 
  getUserActivity, 
  getSalesByMonth 
} = require('../../utils/inMemoryData');

// GET /api/analytics/product-views - Récupérer les vues des produits
router.get('/product-views', (req, res) => {
  const productViews = getProductViews();
  res.json({
    success: true,
    data: productViews
  });
});

// GET /api/analytics/sales-by-category - Récupérer les ventes par catégorie
router.get('/sales-by-category', (req, res) => {
  const salesByCategory = getSalesByCategory();
  res.json({
    success: true,
    data: salesByCategory
  });
});

// GET /api/analytics/user-activity - Récupérer l'activité des utilisateurs
router.get('/user-activity', (req, res) => {
  const userActivity = getUserActivity();
  res.json({
    success: true,
    data: userActivity
  });
});

// GET /api/analytics/sales-by-month - Récupérer les ventes par mois
router.get('/sales-by-month', (req, res) => {
  const salesByMonth = getSalesByMonth();
  res.json({
    success: true,
    data: salesByMonth
  });
});

module.exports = router;