'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  paypalEmail?: string;
}

export type CheckoutStep = 'review' | 'shipping' | 'payment' | 'confirmation';

interface CheckoutState {
  currentStep: CheckoutStep;
  shippingAddress: Partial<ShippingAddress>;
  paymentMethod: Partial<PaymentMethod>;
  orderNotes: string;
  isProcessing: boolean;
  orderId: number | null;
  
  // Actions
  setCurrentStep: (step: CheckoutStep) => void;
  updateShippingAddress: (address: Partial<ShippingAddress>) => void;
  updatePaymentMethod: (payment: Partial<PaymentMethod>) => void;
  setOrderNotes: (notes: string) => void;
  setProcessing: (processing: boolean) => void;
  setOrderId: (orderId: number) => void;
  resetCheckout: () => void;
  
  // Navigation helpers
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canProceedToNextStep: () => boolean;
}

const stepOrder: CheckoutStep[] = ['review', 'shipping', 'payment', 'confirmation'];

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      currentStep: 'review',
      shippingAddress: {},
      paymentMethod: {},
      orderNotes: '',
      isProcessing: false,
      orderId: null,

      setCurrentStep: (step) => set({ currentStep: step }),

      updateShippingAddress: (address) =>
        set((state) => ({
          shippingAddress: { ...state.shippingAddress, ...address },
        })),

      updatePaymentMethod: (payment) =>
        set((state) => ({
          paymentMethod: { ...state.paymentMethod, ...payment },
        })),

      setOrderNotes: (notes) => set({ orderNotes: notes }),
      setProcessing: (processing) => set({ isProcessing: processing }),
      setOrderId: (orderId) => set({ orderId }),

      resetCheckout: () =>
        set({
          currentStep: 'review',
          shippingAddress: {},
          paymentMethod: {},
          orderNotes: '',
          isProcessing: false,
          orderId: null,
        }),

      goToNextStep: () => {
        const { currentStep } = get();
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex < stepOrder.length - 1) {
          set({ currentStep: stepOrder[currentIndex + 1] });
        }
      },

      goToPreviousStep: () => {
        const { currentStep } = get();
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex > 0) {
          set({ currentStep: stepOrder[currentIndex - 1] });
        }
      },

      canProceedToNextStep: () => {
        const { currentStep, shippingAddress, paymentMethod } = get();
        
        switch (currentStep) {
          case 'review':
            return true; // Can always proceed from cart review
          case 'shipping':
            return !!(
              shippingAddress.firstName &&
              shippingAddress.lastName &&
              shippingAddress.email &&
              shippingAddress.address &&
              shippingAddress.city &&
              shippingAddress.state &&
              shippingAddress.zipCode &&
              shippingAddress.country
            );
          case 'payment':
            if (paymentMethod.type === 'credit_card' || paymentMethod.type === 'debit_card') {
              return !!(
                paymentMethod.cardNumber &&
                paymentMethod.expiryDate &&
                paymentMethod.cvv &&
                paymentMethod.cardholderName
              );
            } else if (paymentMethod.type === 'paypal') {
              return !!paymentMethod.paypalEmail;
            }
            return false;
          case 'confirmation':
            return false; // Final step, no next step
          default:
            return false;
        }
      },
    }),
    {
      name: 'checkout-store',
      skipHydration: true,
    }
  )
);