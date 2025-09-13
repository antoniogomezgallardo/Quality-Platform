'use client';

import { useState } from 'react';

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockChange,
}: ProductFiltersProps) {
  const [minPrice, setMinPrice] = useState(priceRange.min.toString());
  const [maxPrice, setMaxPrice] = useState(priceRange.max.toString());

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPriceRangeChange({
      min: Number(minPrice) || 0,
      max: Number(maxPrice) || 999999,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      
      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Category</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value=""
              checked={selectedCategory === ''}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">All Categories</span>
          </label>
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
        <form onSubmit={handlePriceSubmit} className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-1 px-3 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
        </form>
      </div>

      {/* Stock Status */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Availability</h4>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="mr-2 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">In Stock Only</span>
        </label>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          onCategoryChange('');
          onPriceRangeChange({ min: 0, max: 999999 });
          onInStockChange(false);
          setMinPrice('');
          setMaxPrice('');
        }}
        className="w-full py-2 px-4 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}