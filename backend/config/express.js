const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { allowedOrigins } = require('./env');

module.exports = (app) => {
  // Configuration de CORS
  app.use(cors({
    origin: (origin, callback) => {
      // Permettre les requêtes sans origine (comme les appels API mobiles)
      if (!origin) return callback(null, true);
      
      // Vérifier si l'origine est autorisée
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Bloqué par CORS'), false);
      }
    },
    credentials: true
  }));

  // Middlewares de sécurité
  app.use(helmet());
  
  // Parsing du corps de la requête
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Journalisation en développement
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  
  // Middleware pour gérer les erreurs CORS
  app.use((err, req, res, next) => {
    if (err.message === 'Bloqué par CORS') {
      return res.status(403).json({
        success: false,
        message: 'CORS non autorisé pour cette origine'
      });
    }
    next(err);
  });
};