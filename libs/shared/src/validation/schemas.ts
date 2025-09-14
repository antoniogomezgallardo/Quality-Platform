// Note: These decorators require class-validator to be installed in the consuming project
// import { IsEmail, IsPhoneNumber, IsUrl, IsUUID, IsCreditCard, IsPostalCode, ValidationOptions } from 'class-validator';

/**
 * Common validation schemas for use with class-validator
 */

/**
 * Note: The following decorators require class-validator to be installed in the consuming project.
 * They are provided as reference implementations.
 */

/**
 * Reusable email validation decorator factory
 * Usage: Apply @IsValidEmail() to class properties
 */
export function IsValidEmail(validationOptions?: any) {
  return function (target: any, propertyKey: string) {
    // This is a placeholder - actual implementation requires class-validator
    console.warn('IsValidEmail decorator requires class-validator to be installed');
  };
}

/**
 * Reusable phone validation decorator factory
 * Usage: Apply @IsValidPhone() to class properties
 */
export function IsValidPhone(locale?: string, validationOptions?: any) {
  return function (target: any, propertyKey: string) {
    // This is a placeholder - actual implementation requires class-validator
    console.warn('IsValidPhone decorator requires class-validator to be installed');
  };
}

/**
 * Reusable URL validation decorator factory
 * Usage: Apply @IsValidUrl() to class properties
 */
export function IsValidUrl(validationOptions?: any) {
  return function (target: any, propertyKey: string) {
    // This is a placeholder - actual implementation requires class-validator
    console.warn('IsValidUrl decorator requires class-validator to be installed');
  };
}

/**
 * Reusable UUID validation decorator factory
 * Usage: Apply @IsValidUUID() to class properties
 */
export function IsValidUUID(version?: '3' | '4' | '5', validationOptions?: any) {
  return function (target: any, propertyKey: string) {
    // This is a placeholder - actual implementation requires class-validator
    console.warn('IsValidUUID decorator requires class-validator to be installed');
  };
}

/**
 * Reusable credit card validation decorator factory
 * Usage: Apply @IsValidCreditCard() to class properties
 */
export function IsValidCreditCard(validationOptions?: any) {
  return function (target: any, propertyKey: string) {
    // This is a placeholder - actual implementation requires class-validator
    console.warn('IsValidCreditCard decorator requires class-validator to be installed');
  };
}

/**
 * Reusable postal code validation decorator factory
 * Usage: Apply @IsValidPostalCode() to class properties
 */
export function IsValidPostalCode(locale: string, validationOptions?: any) {
  return function (target: any, propertyKey: string) {
    // This is a placeholder - actual implementation requires class-validator
    console.warn('IsValidPostalCode decorator requires class-validator to be installed');
  };
}

/**
 * Common validation schemas for different entities
 */
export const ValidationSchemas = {
  /**
   * User registration schema
   */
  userRegistration: {
    email: { required: true, type: 'email' },
    password: { required: true, minLength: 8, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/ },
    firstName: { required: true, minLength: 1, maxLength: 50 },
    lastName: { required: true, minLength: 1, maxLength: 50 },
    phone: { required: false, type: 'phone' },
  },

  /**
   * Product creation schema
   */
  productCreation: {
    name: { required: true, minLength: 1, maxLength: 200 },
    description: { required: true, minLength: 10, maxLength: 5000 },
    price: { required: true, min: 0, type: 'number' },
    sku: { required: true, pattern: /^[A-Z0-9-]+$/ },
    stock: { required: true, min: 0, type: 'integer' },
  },

  /**
   * Order creation schema
   */
  orderCreation: {
    customerId: { required: true, type: 'uuid' },
    items: { required: true, type: 'array', minItems: 1 },
    shippingAddress: { required: true, type: 'object' },
    billingAddress: { required: true, type: 'object' },
    paymentMethod: { required: true, enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer'] },
  },

  /**
   * Address schema
   */
  address: {
    street: { required: true, minLength: 1, maxLength: 200 },
    city: { required: true, minLength: 1, maxLength: 100 },
    state: { required: false, minLength: 2, maxLength: 100 },
    country: { required: true, minLength: 2, maxLength: 2 }, // ISO country code
    postalCode: { required: true, type: 'postalCode' },
  },

  /**
   * Payment schema
   */
  payment: {
    cardNumber: { required: true, type: 'creditCard' },
    cardHolder: { required: true, minLength: 1, maxLength: 100 },
    expiryMonth: { required: true, min: 1, max: 12, type: 'integer' },
    expiryYear: { required: true, min: new Date().getFullYear(), type: 'integer' },
    cvv: { required: true, pattern: /^\d{3,4}$/ },
  },
};

/**
 * Validation error formatter
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  constraints?: Record<string, string>;
}

/**
 * Format validation errors for API responses
 */
export function formatValidationErrors(errors: any[]): ValidationError[] {
  return errors.map(error => ({
    field: error.property,
    message: Object.values(error.constraints || {}).join(', '),
    value: error.value,
    constraints: error.constraints,
  }));
}