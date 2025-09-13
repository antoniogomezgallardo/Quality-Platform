import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { ProductsQuery, Product } from '../api/types';

export function useProducts(query?: ProductsQuery) {
  return useQuery({
    queryKey: ['products', query],
    queryFn: () => apiClient.getProducts(query),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => apiClient.getProduct(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: ['product-categories'],
    queryFn: () => apiClient.getProductCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: ['products-by-category', category],
    queryFn: () => apiClient.getProductsByCategory(category),
    enabled: !!category,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProductSearch(searchTerm: string) {
  return useQuery({
    queryKey: ['product-search', searchTerm],
    queryFn: () => apiClient.searchProducts(searchTerm),
    enabled: searchTerm.length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}