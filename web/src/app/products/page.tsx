'use client';

import { useState, useEffect } from 'react';
import { useProducts, useProductCategories } from '../../lib/hooks/use-products';
import { ProductGrid } from '../../components/products/product-grid';
import { ProductFilters } from '../../components/products/product-filters';
import { ProductSearch } from '../../components/products/product-search';
import { ProductPagination } from '../../components/products/product-pagination';
import type { ProductsQuery } from '../../lib/api/types';

export default function ProductsPage() {
  const [query, setQuery] = useState<ProductsQuery>({
    page: 1,
    limit: 12,
    search: '',
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    inStock: undefined,
  });

  const { data: productsData, isLoading } = useProducts(query);
  const { data: categories } = useProductCategories();

  const handleSearch = (searchTerm: string) => {
    setQuery(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleCategoryChange = (category: string) => {
    setQuery(prev => ({ ...prev, category, page: 1 }));
  };

  const handlePriceRangeChange = (range: { min: number; max: number }) => {
    setQuery(prev => ({
      ...prev,
      minPrice: range.min > 0 ? range.min : undefined,
      maxPrice: range.max < 999999 ? range.max : undefined,
      page: 1,
    }));
  };

  const handleInStockChange = (inStock: boolean) => {
    setQuery(prev => ({ ...prev, inStock: inStock || undefined, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: any) => {
    // TODO: Implement cart functionality
    console.log('Add to cart:', product);
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
        <ProductSearch onSearch={handleSearch} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <ProductFilters
            categories={categories || []}
            selectedCategory={query.category || ''}
            onCategoryChange={handleCategoryChange}
            priceRange={{
              min: query.minPrice || 0,
              max: query.maxPrice || 999999,
            }}
            onPriceRangeChange={handlePriceRangeChange}
            inStockOnly={query.inStock || false}
            onInStockChange={handleInStockChange}
          />
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          {query.search && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Search results for: <span className="font-semibold">{query.search}</span>
              </p>
            </div>
          )}

          <ProductGrid
            products={productsData?.data || []}
            onAddToCart={handleAddToCart}
            loading={isLoading}
          />

          {productsData && productsData.pagination && (
            <div className="mt-8">
              <ProductPagination
                currentPage={productsData.pagination.page}
                totalPages={productsData.pagination.totalPages}
                totalItems={productsData.pagination.total}
                pageSize={productsData.pagination.limit}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}