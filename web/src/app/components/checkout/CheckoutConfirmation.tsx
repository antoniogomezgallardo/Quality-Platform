'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '../../../lib/stores/checkout';
import { useCartStore } from '../../../lib/stores/cart';
import { useAuth } from '../../../lib/auth/context';
import { tokenManager } from '../../../lib/auth/token';

export function CheckoutConfirmation() {
  const router = useRouter();
  const { 
    shippingAddress, 
    paymentMethod, 
    orderNotes, 
    isProcessing, 
    setProcessing, 
    setOrderId,
    orderId,
    goToPreviousStep 
  } = useCheckoutStore();
  const { items, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuth();
  const token = tokenManager.getToken();
  
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = async () => {
    setProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          notes: orderNotes,
          shippingAddress,
          paymentMethod
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const orderData = await response.json();
      setOrderId(orderData.id);
      clearCart();
      
      // Redirect to success page after a short delay
      setTimeout(() => {
        router.push(`/orders/${orderData.id}?success=true`);
      }, 2000);

    } catch (err) {
      console.error('Order placement failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  const maskCardNumber = (cardNumber?: string) => {
    if (!cardNumber) return '';
    const cleaned = cardNumber.replace(/\s/g, '');
    return `**** **** **** ${cleaned.slice(-4)}`;
  };

  if (orderId) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-6">
          Your order #{orderId} has been received and is being processed.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to order details...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Confirmation</h2>
        <p className="text-gray-600 mb-6">
          Please review your order details before placing your order.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
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
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {orderNotes && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Order Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{orderNotes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Shipping & Payment Details */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </p>
              <p className="text-gray-700">{shippingAddress.address}</p>
              <p className="text-gray-700">
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
              </p>
              <p className="text-gray-700">{shippingAddress.country}</p>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600">Email: {shippingAddress.email}</p>
                <p className="text-sm text-gray-600">Phone: {shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {paymentMethod.type === 'credit_card' && (
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                    <rect width="32" height="20" rx="4" fill="#1e40af"/>
                    <rect x="2" y="2" width="28" height="16" rx="2" fill="#3b82f6"/>
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Credit Card</p>
                    <p className="text-sm text-gray-600">{maskCardNumber(paymentMethod.cardNumber)}</p>
                    <p className="text-sm text-gray-600">{paymentMethod.cardholderName}</p>
                  </div>
                </div>
              )}
              
              {paymentMethod.type === 'debit_card' && (
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                    <rect width="32" height="20" rx="4" fill="#059669"/>
                    <rect x="2" y="2" width="28" height="16" rx="2" fill="#10b981"/>
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Debit Card</p>
                    <p className="text-sm text-gray-600">{maskCardNumber(paymentMethod.cardNumber)}</p>
                    <p className="text-sm text-gray-600">{paymentMethod.cardholderName}</p>
                  </div>
                </div>
              )}
              
              {paymentMethod.type === 'paypal' && (
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                    <rect width="32" height="20" rx="4" fill="#0070ba"/>
                    <path d="M8 6h4c2 0 3 1 3 3s-1 3-3 3h-2l-1 4H7l2-10z" fill="white"/>
                    <path d="M12 10h4c2 0 3 1 3 3s-1 3-3 3h-2l-1 4h-2l2-10z" fill="white" fillOpacity="0.8"/>
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">PayPal</p>
                    <p className="text-sm text-gray-600">{paymentMethod.paypalEmail}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={goToPreviousStep}
          disabled={isProcessing}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Back to Payment
        </button>
        
        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {isProcessing ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <span>Place Order - ${total.toFixed(2)}</span>
          )}
        </button>
      </div>
    </div>
  );
}