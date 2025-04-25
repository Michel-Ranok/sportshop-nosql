// src/hooks/useTimeSeries.ts
import { useState, useEffect } from 'react';
import { analyticsService } from '../services/api';

type TimeScale = 'hourly' | 'daily' | 'weekly' | 'monthly';

interface TimeSeriesData {
  timestamp: Date;
  value: number;
}

export const useTimeSeries = (dataType: 'sales' | 'views', timeScale: TimeScale = 'monthly') => {
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeSeries = async () => {
      setLoading(true);
      try {
        // Simuler un appel à Cassandra
        let result: TimeSeriesData[] = [];
        if (dataType === 'sales') {
          const salesData = await analyticsService.getSalesByMonth();
          result = salesData?.map(item => ({
            timestamp: new Date(item.month),
            value: item.sales
          })) || [];
        } else if (dataType === 'views') {
          const viewsData = await analyticsService.getProductViews();
          result = viewsData?.map(item => ({
            timestamp: new Date(),
            value: item.views
          })) || [];
        }
        setData(result);
        setError(null);
      } catch (err) {
        setError(`Erreur lors de la récupération des données temporelles`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSeries();
  }, [dataType, timeScale]);

  return { data, loading, error };
};