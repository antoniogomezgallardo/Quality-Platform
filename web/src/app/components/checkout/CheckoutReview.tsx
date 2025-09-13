'use client';

import { useState } from 'react';
import { useCheckoutStore } from '../../../lib/stores/checkout';
import { useCartStore } from '../../../lib/stores/cart';

export function CheckoutReview() {
  const { goToNextStep, canProceedToNextStep, orderNotes, setOrderNotes } = useCheckoutStore();
  const { items, updateQuantity, removeFromCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  const handleProceed = () => {
    if (canProceedToNextStep()) {
      goToNextStep();
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Your Order</h2>
        <p className="text-gray-600 mb-6">
          Please review your items before proceeding to shipping information.
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <div key={item.id} className="py-6">
            <div className="flex items-center space-x-4">
              {item.product.imageUrl && (
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-16 w-16 rounded-md object-cover"
                />
              )}
              
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                <p className="text-gray-600">{item.product.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  ${item.product.price.toFixed(2)} each
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                  disabled={isProcessing}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                
                <span className="w-12 text-center font-medium">{item.quantity}</span>
                
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                  disabled={isProcessing}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>

              <div className="text-right">
                <p className="text-lg font-medium text-gray-900">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-sm text-red-600 hover:text-red-500 mt-1"
                  disabled={isProcessing}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          {shipping === 0 && (
            <p className="text-sm text-green-600">🎉 Free shipping on orders over $50!</p>
          )}
          <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="order-notes" className="block text-sm font-medium text-gray-700 mb-2">
          Order Notes (Optional)
        </label>
        <textarea
          id="order-notes"
          rows={3}
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          placeholder="Any special instructions for your order..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Back to Cart
        </button>
        
        <button
          onClick={handleProceed}
          disabled={!canProceedToNextStep() || items.length === 0}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Shipping
        </button>
      </div>
    </div>
  );
}