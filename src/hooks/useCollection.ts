// src/hooks/useCollection.ts
import { useState, useEffect } from 'react';
import { productService } from '../services/api';

export const useCollection = <T>(collectionName: string, query: object = {}) => {
  const [documents, setDocuments] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        // Exemple simplifié simulant un appel MongoDB
        let result;
        if (collectionName === 'products') {
          if ('category' in query) {
            result = await productService.getByCategory(query.category as string);
          } else {
            result = await productService.getAll();
          }
        }
        setDocuments(result as T[]);
        setError(null);
      } catch (err) {
        setError(`Erreur lors de l'accès à la collection ${collectionName}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [collectionName, JSON.stringify(query)]);

  return { documents, loading, error };
};