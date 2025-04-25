// src/hooks/useSearch.ts
import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/api';
import { Product } from '../types';
import { useNotifications } from '../context/NotificationContext';
import { debounce } from 'lodash';

export const useSearch = (initialQuery: string = '') => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const { addNotification } = useNotifications();

  // Utiliser debounce pour éviter trop d'appels API pendant la saisie
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // Dans l'implémentation finale, ceci appellera MongoDB
        const searchResults = await productService.search(searchQuery);
        setResults(searchResults);
      } catch (err) {
        console.error('Error searching products:', err);
        addNotification('error', 'Erreur lors de la recherche');
      } finally {
        setLoading(false);
      }
    }, 300),
    [addNotification, setResults, setLoading]
  );

  // Déclencher la recherche quand la requête change
  useEffect(() => {
    debouncedSearch(query);
    
    // Montrer les résultats si la requête n'est pas vide
    if (query.trim()) {
      setShowResults(true);
    }
    
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  // Fonction pour effacer la recherche
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return {
    query,
    setQuery,
    results,
    loading,
    showResults,
    setShowResults,
    clearSearch
  };
};