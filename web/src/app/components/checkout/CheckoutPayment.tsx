'use client';

import { useState } from 'react';
import { useCheckoutStore, PaymentMethod } from '../../../lib/stores/checkout';

export function CheckoutPayment() {
  const { 
    paymentMethod, 
    updatePaymentMethod, 
    goToNextStep, 
    goToPreviousStep, 
    canProceedToNextStep 
  } = useCheckoutStore();
  
  const [errors, setErrors] = useState<Partial<PaymentMethod>>({});

  const handleInputChange = (field: keyof PaymentMethod, value: string) => {
    updatePaymentMethod({ [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePaymentTypeChange = (type: PaymentMethod['type']) => {
    updatePaymentMethod({ 
      type,
      // Clear other payment method fields when switching types
      cardNumber: undefined,
      expiryDate: undefined,
      cvv: undefined,
      cardholderName: undefined,
      paypalEmail: undefined
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentMethod> = {};

    if (!paymentMethod.type) {
      return false;
    }

    if (paymentMethod.type === 'credit_card' || paymentMethod.type === 'debit_card') {
      if (!paymentMethod.cardNumber?.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(paymentMethod.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }

      if (!paymentMethod.expiryDate?.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(paymentMethod.expiryDate)) {
        newErrors.expiryDate = 'Please enter date in MM/YY format';
      }

      if (!paymentMethod.cvv?.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(paymentMethod.cvv)) {
        newErrors.cvv = 'Please enter a valid 3 or 4-digit CVV';
      }

      if (!paymentMethod.cardholderName?.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }
    } else if (paymentMethod.type === 'paypal') {
      if (!paymentMethod.paypalEmail?.trim()) {
        newErrors.paypalEmail = 'PayPal email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentMethod.paypalEmail)) {
        newErrors.paypalEmail = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      goToNextStep();
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
        <p className="text-gray-600 mb-6">
          Choose your preferred payment method and enter the required details.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Credit Card Option */}
          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              paymentMethod.type === 'credit_card' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handlePaymentTypeChange('credit_card')}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                checked={paymentMethod.type === 'credit_card'}
                onChange={() => handlePaymentTypeChange('credit_card')}
                className="text-blue-600"
              />
              <div className="flex items-center space-x-2">
                <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                  <rect width="32" height="20" rx="4" fill="#1e40af"/>
                  <rect x="2" y="2" width="28" height="16" rx="2" fill="#3b82f6"/>
                </svg>
                <span className="font-medium">Credit Card</span>
              </div>
            </div>
          </div>

          {/* Debit Card Option */}
          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              paymentMethod.type === 'debit_card' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handlePaymentTypeChange('debit_card')}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                checked={paymentMethod.type === 'debit_card'}
                onChange={() => handlePaymentTypeChange('debit_card')}
                className="text-blue-600"
              />
              <div className="flex items-center space-x-2">
                <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                  <rect width="32" height="20" rx="4" fill="#059669"/>
                  <rect x="2" y="2" width="28" height="16" rx="2" fill="#10b981"/>
                </svg>
                <span className="font-medium">Debit Card</span>
              </div>
            </div>
          </div>

          {/* PayPal Option */}
          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              paymentMethod.type === 'paypal' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handlePaymentTypeChange('paypal')}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                checked={paymentMethod.type === 'paypal'}
                onChange={() => handlePaymentTypeChange('paypal')}
                className="text-blue-600"
              />
              <div className="flex items-center space-x-2">
                <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                  <rect width="32" height="20" rx="4" fill="#0070ba"/>
                  <path d="M8 6h4c2 0 3 1 3 3s-1 3-3 3h-2l-1 4H7l2-10z" fill="white"/>
                  <path d="M12 10h4c2 0 3 1 3 3s-1 3-3 3h-2l-1 4h-2l2-10z" fill="white" fillOpacity="0.8"/>
                </svg>
                <span className="font-medium">PayPal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Details Form */}
        {(paymentMethod.type === 'credit_card' || paymentMethod.type === 'debit_card') && (
          <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900">Card Details</h3>
            
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number *
              </label>
              <input
                type="text"
                id="cardNumber"
                value={paymentMethod.cardNumber || ''}
                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  value={paymentMethod.expiryDate || ''}
                  onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                  CVV *
                </label>
                <input
                  type="text"
                  id="cvv"
                  value={paymentMethod.cvv || ''}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.cvv ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="123"
                  maxLength={4}
                />
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name *
              </label>
              <input
                type="text"
                id="cardholderName"
                value={paymentMethod.cardholderName || ''}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cardholderName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter name as it appears on card"
              />
              {errors.cardholderName && (
                <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
              )}
            </div>
          </div>
        )}

        {/* PayPal Details Form */}
        {paymentMethod.type === 'paypal' && (
          <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900">PayPal Details</h3>
            
            <div>
              <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-700 mb-1">
                PayPal Email Address *
              </label>
              <input
                type="email"
                id="paypalEmail"
                value={paymentMethod.paypalEmail || ''}
                onChange={(e) => handleInputChange('paypalEmail', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.paypalEmail ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your PayPal email address"
              />
              {errors.paypalEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.paypalEmail}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                You will be redirected to PayPal to complete your payment securely.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={goToPreviousStep}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Back to Shipping
        </button>
        
        <button
          onClick={handleContinue}
          disabled={!canProceedToNextStep()}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Review Order
        </button>
      </div>
    </div>
  );
}