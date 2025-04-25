import React, { useState } from 'react';

interface ProductFilterProps {
  categories: string[];
  sports: string[];
  onFilterChange: (filters: { categories: string[]; sports: string[]; priceRange: [number, number] }) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ categories, sports, onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);

  const handleCategoryChange = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    onFilterChange({
      categories: newCategories,
      sports: selectedSports,
      priceRange
    });
  };

  const handleSportChange = (sport: string) => {
    const newSports = selectedSports.includes(sport)
      ? selectedSports.filter(s => s !== sport)
      : [...selectedSports, sport];
    
    setSelectedSports(newSports);
    onFilterChange({
      categories: selectedCategories,
      sports: newSports,
      priceRange
    });
  };

  const handlePriceChange = (index: number, value: number) => {
    const newPriceRange: [number, number] = [...priceRange] as [number, number];
    newPriceRange[index] = value;
    setPriceRange(newPriceRange);
    onFilterChange({
      categories: selectedCategories,
      sports: selectedSports,
      priceRange: newPriceRange
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Filtres</h2>
      
      <div className="mb-4">
        <h3 className="font-medium mb-2">Catégories</h3>
        {categories.map(category => (
          <div key={category} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`cat-${category}`}
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
              className="mr-2"
            />
            <label htmlFor={`cat-${category}`}>{category}</label>
          </div>
        ))}
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium mb-2">Sports</h3>
        {sports.map(sport => (
          <div key={sport} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`sport-${sport}`}
              checked={selectedSports.includes(sport)}
              onChange={() => handleSportChange(sport)}
              className="mr-2"
            />
            <label htmlFor={`sport-${sport}`}>{sport}</label>
          </div>
        ))}
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Prix</h3>
        <div className="flex justify-between mb-1">
          <span>{priceRange[0]}€</span>
          <span>{priceRange[1]}€</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          value={priceRange[0]}
          onChange={(e) => handlePriceChange(0, Number(e.target.value))}
          className="w-full mb-2"
        />
        <input
          type="range"
          min="0"
          max="200"
          value={priceRange[1]}
          onChange={(e) => handlePriceChange(1, Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ProductFilter;