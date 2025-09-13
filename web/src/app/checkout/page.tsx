'use client';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Checkout</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg className="mx-auto w-24 h-24 text-blue-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Checkout Feature Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              The checkout functionality is being implemented. This will include payment processing, 
              shipping options, and order confirmation.
            </p>
            <div className="space-y-2">
              <a
                href="/cart"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors mr-4"
              >
                Back to Cart
              </a>
              <a
                href="/products"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}