'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProduct } from '../../../lib/hooks/use-products';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  
  const { data: product, isLoading, error } = useProduct(productId);

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log('Add to cart:', product);
    alert(`Added ${product?.name} to cart!`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-300 rounded"></div>
            <div>
              <div className="h-10 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link 
            href="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link href="/products" className="ml-1 text-gray-700 hover:text-blue-600 md:ml-2">
                Products
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-1 text-gray-500 md:ml-2">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Product Detail */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Product Image */}
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <svg className="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <span className="text-sm text-gray-500 uppercase bg-gray-100 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <span className="ml-4">
                {isOutOfStock ? (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                ) : (
                  <span className="text-green-600 font-medium">{product.stock} in stock</span>
                )}
              </span>
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="mb-6">
              <p className="text-4xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Product Details</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>SKU: PROD-{product.id.toString().padStart(4, '0')}</li>
                <li>Category: {product.category}</li>
                <li>Availability: {isOutOfStock ? 'Out of Stock' : `${product.stock} units available`}</li>
                <li>Ships within 2-3 business days</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
              
              <button
                className="py-3 px-6 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-8 bg-white rounded-lg shadow p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
        <div className="prose max-w-none text-gray-600">
          <p>
            This is a sample product from our quality platform demo. In a real application, 
            this section would contain detailed product specifications, materials, care instructions, 
            and other relevant information.
          </p>
          <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">Features</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>High-quality materials</li>
            <li>Sustainable manufacturing</li>
            <li>1-year warranty included</li>
            <li>Free shipping on orders over $50</li>
          </ul>
        </div>
      </div>
    </div>
  );
}