// src/hooks/useSessionStorage.ts
import { useState, useEffect } from 'react';

export const useSessionStorage = <T>(key: string, initialValue: T = null as T) => {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simuler la récupération depuis Redis
  useEffect(() => {
    const fetchValue = async () => {
      setLoading(true);
      try {
        // Dans l'implémentation finale, ceci appellera Redis
        const storedValue = localStorage.getItem(key);
        setValue(storedValue ? JSON.parse(storedValue) : initialValue);
        setError(null);
      } catch (err) {
        setError('Erreur lors de la récupération des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchValue();
  }, [key, initialValue]);

  // Simuler la sauvegarde dans Redis
  const updateValue = async (newValue: T) => {
    try {
      // Dans l'implémentation finale, ceci appellera Redis
      localStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
      return true;
    } catch (err) {
      setError('Erreur lors de la sauvegarde des données');
      console.error(err);
      return false;
    }
  };

  return { value, setValue: updateValue, loading, error };
};