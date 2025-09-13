'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '../../lib/stores/checkout';
import { useCartStore } from '../../lib/stores/cart';
import { CheckoutReview } from '../components/checkout/CheckoutReview';
import { CheckoutShipping } from '../components/checkout/CheckoutShipping';
import { CheckoutPayment } from '../components/checkout/CheckoutPayment';
import { CheckoutConfirmation } from '../components/checkout/CheckoutConfirmation';
import { CheckoutProgress } from '../components/checkout/CheckoutProgress';

export default function CheckoutPage() {
  const router = useRouter();
  const { currentStep, resetCheckout } = useCheckoutStore();
  const { items } = useCartStore();

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  useEffect(() => {
    return () => {
      if (currentStep === 'confirmation') {
        resetCheckout();
      }
    };
  }, [currentStep, resetCheckout]);

  if (items.length === 0) {
    return null;
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'review':
        return <CheckoutReview />;
      case 'shipping':
        return <CheckoutShipping />;
      case 'payment':
        return <CheckoutPayment />;
      case 'confirmation':
        return <CheckoutConfirmation />;
      default:
        return <CheckoutReview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Checkout</h1>
            <CheckoutProgress />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {renderCurrentStep()}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>
                        ${items.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}