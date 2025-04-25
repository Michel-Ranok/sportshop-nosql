const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus 
} = require('../../utils/inMemoryData');

// Middleware de simulation d'authentification
const simulateAuth = (req, res, next) => {
  req.userId = req.headers['user-id'] || 'u1';
  next();
};

// Appliquer le middleware sur toutes les routes
router.use(simulateAuth);

// POST /api/orders - Créer une nouvelle commande
router.post('/', (req, res) => {
  const { items, total, address } = req.body;
  
  if (!items || !items.length) {
    return res.status(400).json({
      success: false,
      message: 'Les articles de la commande sont requis'
    });
  }
  
  try {
    const newOrder = createOrder({ items, total, address }, req.userId);
    
    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la commande',
      error: error.message
    });
  }
});

// GET /api/orders - Récupérer les commandes de l'utilisateur
router.get('/', (req, res) => {
  const orders = getUserOrders(req.userId);
  
  res.json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// GET /api/orders/:id - Récupérer une commande par son ID
router.get('/:id', (req, res) => {
  const order = getOrderById(req.params.id);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Commande non trouvée'
    });
  }
  
  // Vérifier que l'utilisateur est autorisé à voir cette commande
  if (order.userId !== req.userId) {
    return res.status(403).json({
      success: false,
      message: 'Non autorisé à accéder à cette commande'
    });
  }
  
  res.json({
    success: true,
    data: order
  });
});

// PUT /api/orders/:id/status - Mettre à jour le statut d'une commande
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Le statut de la commande est requis'
    });
  }
  
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Statut de commande non valide'
    });
  }
  
  const updatedOrder = updateOrderStatus(req.params.id, status);
  
  if (!updatedOrder) {
    return res.status(404).json({
      success: false,
      message: 'Commande non trouvée'
    });
  }
  
  res.json({
    success: true,
    message: 'Statut de la commande mis à jour',
    data: updatedOrder
  });
});

// PUT /api/orders/:id/cancel - Annuler une commande
router.put('/:id/cancel', (req, res) => {
  const updatedOrder = updateOrderStatus(req.params.id, 'cancelled');
  
  if (!updatedOrder) {
    return res.status(404).json({
      success: false,
      message: 'Commande non trouvée'
    });
  }
  
  res.json({
    success: true,
    message: 'Commande annulée',
    data: updatedOrder
  });
});

module.exports = router;