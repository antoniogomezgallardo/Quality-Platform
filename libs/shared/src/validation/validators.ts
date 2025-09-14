/**
 * Email validation using RFC 5322 compliant regex
 * @param email - Email address to validate
 * @returns true if email is valid, false otherwise
 */
export function emailValidator(email: string): boolean {
  if (!email || typeof email !== 'string') return false;

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

/**
 * Phone number validation (international format)
 * @param phone - Phone number to validate
 * @returns true if phone is valid, false otherwise
 */
export function phoneValidator(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;

  // Remove all non-digit characters except + at the beginning
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Check for valid international or local format
  const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  return phoneRegex.test(cleaned) && cleaned.replace(/\D/g, '').length >= 7;
}

/**
 * URL validation
 * @param url - URL to validate
 * @returns true if URL is valid, false otherwise
 */
export function urlValidator(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    const urlObj = new URL(url);
    return ['http:', 'https:', 'ftp:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * UUID v4 validation
 * @param uuid - UUID to validate
 * @returns true if UUID is valid v4 format, false otherwise
 */
export function uuidValidator(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') return false;

  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(uuid);
}

/**
 * Credit card validation using Luhn algorithm
 * @param cardNumber - Credit card number to validate
 * @returns true if card number is valid, false otherwise
 */
export function creditCardValidator(cardNumber: string): boolean {
  if (!cardNumber || typeof cardNumber !== 'string') return false;

  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  // Check if it's all digits
  if (!/^\d+$/.test(cleaned)) return false;

  // Check length (most cards are 13-19 digits)
  if (cleaned.length < 13 || cleaned.length > 19) return false;

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Password strength validator
 * @param password - Password to validate
 * @param options - Validation options
 * @returns true if password meets strength requirements, false otherwise
 */
export interface PasswordOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

export function passwordValidator(
  password: string,
  options: PasswordOptions = {}
): boolean {
  if (!password || typeof password !== 'string') return false;

  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = options;

  if (password.length < minLength) return false;
  if (requireUppercase && !/[A-Z]/.test(password)) return false;
  if (requireLowercase && !/[a-z]/.test(password)) return false;
  if (requireNumbers && !/\d/.test(password)) return false;
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;

  return true;
}

/**
 * Date validation and range checking
 * @param date - Date string or Date object to validate
 * @param options - Validation options
 * @returns true if date is valid and within range, false otherwise
 */
export interface DateValidationOptions {
  minDate?: Date;
  maxDate?: Date;
  allowFuture?: boolean;
  allowPast?: boolean;
}

export function dateValidator(
  date: string | Date,
  options: DateValidationOptions = {}
): boolean {
  const {
    minDate,
    maxDate,
    allowFuture = true,
    allowPast = true,
  } = options;

  let dateObj: Date;

  if (typeof date === 'string') {
    dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return false;
  } else if (date instanceof Date) {
    if (isNaN(date.getTime())) return false;
    dateObj = date;
  } else {
    return false;
  }

  const now = new Date();

  if (!allowFuture && dateObj > now) return false;
  if (!allowPast && dateObj < now) return false;
  if (minDate && dateObj < minDate) return false;
  if (maxDate && dateObj > maxDate) return false;

  return true;
}

/**
 * Postal code validation for multiple countries
 * @param postalCode - Postal code to validate
 * @param countryCode - ISO country code (US, UK, CA, etc.)
 * @returns true if postal code is valid for the country, false otherwise
 */
export function postalCodeValidator(postalCode: string, countryCode: string): boolean {
  if (!postalCode || typeof postalCode !== 'string') return false;
  if (!countryCode || typeof countryCode !== 'string') return false;

  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    UK: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
    FR: /^\d{5}$/,
    DE: /^\d{5}$/,
    ES: /^\d{5}$/,
    IT: /^\d{5}$/,
    JP: /^\d{3}-?\d{4}$/,
    AU: /^\d{4}$/,
    BR: /^\d{5}-?\d{3}$/,
  };

  const pattern = patterns[countryCode.toUpperCase()];
  return pattern ? pattern.test(postalCode) : false;
}