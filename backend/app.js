// app.js
const express = require('express');
const { port } = require('./config/env');
const mongoService = require('./services/mongodb');

// Création de l'application Express
const app = express();

// Connexion à MongoDB
mongoService.connect();

// Application des configurations
require('./config/express')(app);

// Routes
app.use('/api', require('./routes'));

// Middleware de gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port} en mode ${process.env.NODE_ENV}`);
});

module.exports = app;
