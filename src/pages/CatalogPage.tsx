// src/pages/CatalogPage.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { productService } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/catalog/ProductCard';
import { useNotifications } from '../context/NotificationContext';

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const location = useLocation();
  const { addNotification } = useNotifications();
  
  // Extraire les paramètres de recherche de l'URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search');
  const categoryQuery = queryParams.get('category');
  
  useEffect(() => {
    setLoading(true);
    
    const fetchProducts = async () => {
      try {
        let result: Product[] = [];
        
        // Priorité aux recherches textuelles
        if (searchQuery) {
          // Dans l'implémentation réelle, ceci appellerait MongoDB
          result = await productService.search(searchQuery);
          setSelectedCategory('');
        }
        // Ensuite, filtrer par catégorie si spécifié
        else if (categoryQuery) {
          result = await productService.getByCategory(categoryQuery);
          setSelectedCategory(categoryQuery);
        } 
        // Sinon, récupérer tous les produits
        else {
          result = await productService.getAll();
          setSelectedCategory('');
        }
        
        setProducts(result);
      } catch (error) {
        console.error('Error fetching products:', error);
        addNotification('error', 'Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [searchQuery, categoryQuery, addNotification]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {searchQuery 
            ? `Résultats pour "${searchQuery}"`
            : selectedCategory 
              ? `Catégorie : ${selectedCategory}` 
              : "Tous les produits"}
        </h1>
        <div>
          {/* Filtres supplémentaires pourraient être ajoutés ici */}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Aucun produit trouvé</h2>
          <p className="text-gray-600">
            {searchQuery 
              ? "Essayez d'autres termes de recherche"
              : selectedCategory 
                ? `Aucun produit dans la catégorie ${selectedCategory}` 
                : "Aucun produit disponible pour le moment"}
          </p>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;