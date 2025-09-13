'use client';

import { useCheckoutStore, CheckoutStep } from '../../../lib/stores/checkout';

const steps: { key: CheckoutStep; name: string; description: string }[] = [
  { key: 'review', name: 'Review', description: 'Review your items' },
  { key: 'shipping', name: 'Shipping', description: 'Shipping address' },
  { key: 'payment', name: 'Payment', description: 'Payment method' },
  { key: 'confirmation', name: 'Confirmation', description: 'Order confirmation' },
];

export function CheckoutProgress() {
  const { currentStep } = useCheckoutStore();

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.key === currentStep);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <li key={step.key} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            {index !== steps.length - 1 && (
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className={`h-0.5 w-full ${index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'}`} />
              </div>
            )}
            
            <div className="relative flex items-center justify-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  index < currentStepIndex
                    ? 'bg-blue-600 text-white'
                    : index === currentStepIndex
                    ? 'border-2 border-blue-600 bg-white text-blue-600'
                    : 'border-2 border-gray-300 bg-white text-gray-500'
                }`}
              >
                {index < currentStepIndex ? (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className="text-xs font-medium text-gray-900">{step.name}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}