/**
 * Validation module exports
 */

export * from './validators';
export * from './schemas';

// Re-export commonly used validators for convenience
export {
  emailValidator,
  phoneValidator,
  urlValidator,
  uuidValidator,
  creditCardValidator,
  passwordValidator,
  dateValidator,
  postalCodeValidator,
} from './validators';

export {
  IsValidEmail,
  IsValidPhone,
  IsValidUrl,
  IsValidUUID,
  IsValidCreditCard,
  IsValidPostalCode,
  ValidationSchemas,
  formatValidationErrors,
} from './schemas';

// Export types
export type { PasswordOptions, DateValidationOptions } from './validators';
export type { ValidationError } from './schemas';