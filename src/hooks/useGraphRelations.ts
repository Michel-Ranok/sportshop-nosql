// src/hooks/useGraphRelations.ts
import { useState, useEffect } from 'react';
import { recommendationService } from '../services/api';

interface Relation {
  id: string;
  name: string;
  weight?: number;
}

export const useGraphRelations = (nodeId: string, relationType: 'similar' | 'userBased' = 'similar') => {
  const [relations, setRelations] = useState<Relation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelations = async () => {
      setLoading(true);
      try {
        // Simuler un appel à Neo4j
        let result;
        if (relationType === 'similar' && nodeId) {
          result = await recommendationService.getRecommendations(nodeId);
        } else if (relationType === 'userBased') {
          result = await recommendationService.getUserBasedRecommendations();
        }
        setRelations((result || []).map((item: { id?: string; name: string; weight?: number }) => ({
          id: item.id || '', // Provide a default value if id is missing
          name: item.name,
          weight: item.weight,
        })));
        setError(null);
      } catch (err) {
        setError(`Erreur lors de la récupération des relations`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelations();
  }, [nodeId, relationType]);

  return { relations, loading, error };
};