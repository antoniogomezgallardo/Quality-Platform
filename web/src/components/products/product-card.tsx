'use client';

import Link from 'next/link';
import { useCartStore } from '../../lib/stores/cart';
import type { Product } from '../../lib/api/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 cursor-pointer">
          <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
            {product.name}
          </h3>
        </Link>
        
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 uppercase">
              {product.category}
            </p>
          </div>
          
          <div className="text-right">
            {isOutOfStock ? (
              <span className="text-sm text-red-600 font-medium">
                Out of Stock
              </span>
            ) : (
              <span className="text-sm text-green-600 font-medium">
                {product.stock} in stock
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={() => {
            addItem(product);
            onAddToCart?.(product);
          }}
          disabled={isOutOfStock}
          className={`mt-4 w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isOutOfStock
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}