const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../../utils/inMemoryData');

// GET /api/products - Récupérer tous les produits avec filtres optionnels
router.get('/', (req, res) => {
  const filters = {
    category: req.query.category,
    search: req.query.search
  };
  
  const products = getProducts(filters);
  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

// GET /api/products/:id - Récupérer un produit par son ID
router.get('/:id', (req, res) => {
  const product = getProductById(req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Produit non trouvé'
    });
  }
  
  res.json({
    success: true,
    data: product
  });
});

// POST /api/products/search - Recherche de produits
router.post('/search', (req, res) => {
  const { query } = req.body;
  
  const products = getProducts({ search: query });
  
  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

module.exports = router;