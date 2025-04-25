// src/components/search/SearchBar.tsx
import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useSearch } from '../../hooks/useSearch';

const SearchBar: React.FC = () => {
  const { 
    query, 
    setQuery, 
    results, 
    loading, 
    showResults, 
    setShowResults,
    clearSearch 
  } = useSearch();
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Gérer les clics en dehors du composant de recherche
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowResults]);

  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowResults(true)}
            placeholder="Rechercher des produits..." 
            className="w-full py-2 px-4 pr-10 rounded focus:outline-none"
          />
          {query ? (
            <button 
              type="button"
              onClick={clearSearch}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          ) : null}
          <button 
            type="submit" 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FaSearch />
          </button>
        </div>
      </form>
      
      {/* Résultats de recherche */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Recherche en cours...
            </div>
          ) : results.length > 0 ? (
            <div>
              {results.map(product => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="block p-3 border-b hover:bg-gray-50"
                  onClick={() => {
                    clearSearch();
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 mr-3">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{product.name}</h4>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">{product.category}</span>
                        <span className="text-sm font-semibold">{product.price.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <Link
                to={`/catalog?search=${encodeURIComponent(query)}`}
                className="block p-3 text-center text-primary hover:bg-gray-50"
                onClick={() => setShowResults(false)}
              >
                Voir tous les résultats ({results.length})
              </Link>
            </div>
          ) : query.trim() ? (
            <div className="p-4 text-center text-gray-500">
              Aucun produit ne correspond à votre recherche.
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Commencez à taper pour rechercher des produits.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;