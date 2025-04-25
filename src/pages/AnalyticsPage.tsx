import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/api';

// Types pour les analytics
interface SalesData {
  month: string;
  sales: number;
  revenue: number;
}

interface CategorySales {
  category: string;
  sales: number;
  percentage: number;
}

interface ProductView {
  productId: string;
  productName: string;
  views: number;
}

const AnalyticsPage: React.FC = () => {
  const [salesByMonth, setSalesByMonth] = useState<SalesData[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<CategorySales[]>([]);
  const [productViews, setProductViews] = useState<ProductView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les données d'analytiques depuis Cassandra (simulé)
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Dans l'implémentation réelle, ces appels se feraient à Cassandra
        const [monthlyData, categoryData, viewsData] = await Promise.all([
          analyticsService.getSalesByMonth(),
          analyticsService.getSalesByCategory(),
          analyticsService.getProductViews()
        ]);
        
        setSalesByMonth(monthlyData.map(data => ({ ...data, revenue: 0 })));
        const totalSales = categoryData.reduce((sum, item) => sum + item.sales, 0);
        setSalesByCategory(categoryData.map(item => ({
          ...item,
          percentage: ((item.sales / totalSales) * 100)
        })));
        setProductViews(viewsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setError('Erreur lors de la récupération des données analytiques');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord d'analyse</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord d'analyse</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord d'analyse</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Graphique des ventes mensuelles */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Ventes mensuelles</h2>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
            {/* Un composant de graphique serait utilisé ici */}
            <div>
              {salesByMonth.map((item) => (
                <div key={item.month} className="flex justify-between border-b py-2">
                  <span>{item.month}</span>
                  <span>{item.sales} ventes</span>
                  <span>{item.revenue.toFixed(2)}€</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Répartition des ventes par catégorie */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Ventes par catégorie</h2>
          <div className="h-64 bg-gray-100 rounded p-4">
            {/* Un graphique camembert serait utilisé ici */}
            <div>
              {salesByCategory.map((item) => (
                <div key={item.category} className="flex justify-between items-center mb-2">
                  <span>{item.category}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Produits les plus vus */}
        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Produits les plus vus</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 text-left">Produit</th>
                  <th className="py-2 px-4 text-right">Vues</th>
                </tr>
              </thead>
              <tbody>
                {productViews.map((item) => (
                  <tr key={item.productId} className="border-b">
                    <td className="py-2 px-4">{item.productName}</td>
                    <td className="py-2 px-4 text-right">{item.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;