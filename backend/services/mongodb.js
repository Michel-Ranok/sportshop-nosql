//mongodb.js

// backend/services/mongodb.js
const mongoose = require('mongoose');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.zxvhial.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;

// Options de connexion
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Fonction de connexion
const connect = async () => {
  try {
    await mongoose.connect(uri, options);
    console.log('Connexion à MongoDB établie avec succès!');
    return mongoose.connection;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques produits:', error);
    throw error;
  }
};

// Rechercher des produits similaires
const getSimilarProducts = async (productId, limit = 5) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error('Produit non trouvé');
    }

    return await Product.aggregate([
      // Exclure le produit actuel
      { $match: { _id: { $ne: mongoose.Types.ObjectId(productId) } } },
      // Ajouter un champ de score basé sur les catégories et le sport
      {
        $addFields: {
          score: {
            $add: [
              { $cond: [{ $eq: ["$category", product.category] }, 2, 0] },
              { $cond: [{ $eq: ["$sport", product.sport] }, 3, 0] },
              { $cond: [{ $gt: [{ $abs: { $subtract: ["$price", product.price] } }, 50] }, 0, 1] }
            ]
          }
        }
      },
      // Trier par score décroissant
      { $sort: { score: -1, rating: -1 } },
      // Limiter le nombre de résultats
      { $limit: limit },
      // Projeter les champs nécessaires
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          imageUrl: 1,
          category: 1,
          sport: 1,
          rating: 1,
          score: 1
        }
      }
    ]);
  } catch (error) {
    console.error(`Erreur lors de la recherche de produits similaires à ${productId}:`, error);
    throw error;
  }
};

// Fonction de déconnexion
const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log('Déconnexion de MongoDB réussie');
  } catch (error) {
    console.error('Erreur lors de la déconnexion de MongoDB:', error);
  }
};

// Écouteurs d'événements de connexion
mongoose.connection.on('connected', () => {
  console.log('Mongoose connecté à la base de données');
});

mongoose.connection.on('error', (err) => {
  console.error(`Erreur de connexion Mongoose: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose déconnecté de la base de données');
});

// Intercepter les signaux de fermeture de l'application
process.on('SIGINT', async () => {
  await disconnect();
  process.exit(0);
});

module.exports = {
  connect,
  disconnect,
  mongoose
};