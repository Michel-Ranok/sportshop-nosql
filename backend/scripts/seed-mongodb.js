// backend/scripts/seed-mongodb.js
const fs = require('fs');
const path = require('path');
const { connect, disconnect } = require('../services/mongodb');
const Product = require('../models/product');
const User = require('../models/user');

const importData = async () => {
  try {
    // Connexion à MongoDB
    await connect();
    console.log('Connexion à MongoDB établie pour l\'import');

    // Lire les fichiers de données
    const productsPath = path.join(__dirname, '../../src/data/products.json');
    const usersPath = path.join(__dirname, '../../src/data/users.json');

    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

    // Supprimer les données existantes
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Données existantes supprimées');

    // Importer les utilisateurs
    await User.insertMany(usersData);
    console.log(`${usersData.length} utilisateurs importés avec succès`);

    // Importer les produits
    const productsToInsert = productsData.map(product => {
      // Convertir l'ID string en ObjectId si nécessaire
      return {
        ...product,
        _id: product.id // Mongoose convertira automatiquement l'ID string en ObjectId
      };
    });

    await Product.insertMany(productsToInsert);
    console.log(`${productsToInsert.length} produits importés avec succès`);

    console.log('Import des données terminé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'import des données:', error);
  } finally {
    // Déconnexion de MongoDB
    await disconnect();
  }
};

// Exécuter la fonction d'import
importData();
