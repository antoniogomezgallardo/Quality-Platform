/**
 * Custom test assertions and matchers
 */

/**
 * Assert that a value is a valid email
 * @param value - Value to check
 * @returns Assertion result
 */
export function assertEmail(value: any): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return typeof value === 'string' && emailRegex.test(value);
}

/**
 * Assert that a value is a valid UUID
 * @param value - Value to check
 * @returns Assertion result
 */
export function assertUUID(value: any): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof value === 'string' && uuidRegex.test(value);
}

/**
 * Assert that a value is a valid ISO date string
 * @param value - Value to check
 * @returns Assertion result
 */
export function assertISODate(value: any): boolean {
  if (typeof value !== 'string') return false;
  const date = new Date(value);
  return !isNaN(date.getTime()) && date.toISOString() === value;
}

/**
 * Assert that an object has required properties
 * @param obj - Object to check
 * @param properties - Required properties
 * @returns Assertion result
 */
export function assertHasProperties(obj: any, properties: string[]): boolean {
  if (!obj || typeof obj !== 'object') return false;
  return properties.every(prop => prop in obj);
}

/**
 * Assert that a value is within a range
 * @param value - Value to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Assertion result
 */
export function assertInRange(value: number, min: number, max: number): boolean {
  return typeof value === 'number' && value >= min && value <= max;
}

/**
 * Assert that an array contains specific items
 * @param array - Array to check
 * @param items - Items that should be in the array
 * @returns Assertion result
 */
export function assertArrayContains<T>(array: T[], items: T[]): boolean {
  if (!Array.isArray(array)) return false;
  return items.every(item => array.includes(item));
}

/**
 * Assert that an array has a specific length
 * @param array - Array to check
 * @param length - Expected length
 * @returns Assertion result
 */
export function assertArrayLength(array: any[], length: number): boolean {
  return Array.isArray(array) && array.length === length;
}

/**
 * Assert that a string matches a pattern
 * @param value - String to check
 * @param pattern - Pattern to match
 * @returns Assertion result
 */
export function assertStringMatches(value: any, pattern: RegExp): boolean {
  return typeof value === 'string' && pattern.test(value);
}

/**
 * Assert that an object matches a schema
 * @param obj - Object to validate
 * @param schema - Schema definition
 * @returns Assertion result with details
 */
export interface SchemaDefinition {
  [key: string]: {
    type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: any[];
  };
}

export function assertMatchesSchema(obj: any, schema: SchemaDefinition): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!obj || typeof obj !== 'object') {
    return { valid: false, errors: ['Value is not an object'] };
  }

  for (const [key, rules] of Object.entries(schema)) {
    const value = obj[key];

    // Check required fields
    if (rules.required && (value === undefined || value === null)) {
      errors.push(`Field '${key}' is required`);
      continue;
    }

    // Skip optional fields that are not present
    if (!rules.required && (value === undefined || value === null)) {
      continue;
    }

    // Check type
    if (rules.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== rules.type) {
        errors.push(`Field '${key}' must be of type ${rules.type}, got ${actualType}`);
        continue;
      }
    }

    // String validations
    if (typeof value === 'string') {
      if (rules.minLength !== undefined && value.length < rules.minLength) {
        errors.push(`Field '${key}' must have at least ${rules.minLength} characters`);
      }
      if (rules.maxLength !== undefined && value.length > rules.maxLength) {
        errors.push(`Field '${key}' must have at most ${rules.maxLength} characters`);
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`Field '${key}' does not match the required pattern`);
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors.push(`Field '${key}' must be at least ${rules.min}`);
      }
      if (rules.max !== undefined && value > rules.max) {
        errors.push(`Field '${key}' must be at most ${rules.max}`);
      }
    }

    // Enum validation
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`Field '${key}' must be one of: ${rules.enum.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Custom Jest matchers (if using Jest)
 */
export const customMatchers = {
  toBeValidEmail(received: any) {
    const pass = assertEmail(received);
    return {
      pass,
      message: () => pass
        ? `Expected ${received} not to be a valid email`
        : `Expected ${received} to be a valid email`,
    };
  },

  toBeValidUUID(received: any) {
    const pass = assertUUID(received);
    return {
      pass,
      message: () => pass
        ? `Expected ${received} not to be a valid UUID`
        : `Expected ${received} to be a valid UUID`,
    };
  },

  toBeValidISODate(received: any) {
    const pass = assertISODate(received);
    return {
      pass,
      message: () => pass
        ? `Expected ${received} not to be a valid ISO date`
        : `Expected ${received} to be a valid ISO date`,
    };
  },

  toHaveProperties(received: any, properties: string[]) {
    const pass = assertHasProperties(received, properties);
    const missing = properties.filter(prop => !(prop in received));
    return {
      pass,
      message: () => pass
        ? `Expected object not to have properties: ${properties.join(', ')}`
        : `Expected object to have properties: ${missing.join(', ')}`,
    };
  },

  toBeInRange(received: number, min: number, max: number) {
    const pass = assertInRange(received, min, max);
    return {
      pass,
      message: () => pass
        ? `Expected ${received} not to be in range [${min}, ${max}]`
        : `Expected ${received} to be in range [${min}, ${max}]`,
    };
  },

  toMatchSchema(received: any, schema: SchemaDefinition) {
    const result = assertMatchesSchema(received, schema);
    return {
      pass: result.valid,
      message: () => result.valid
        ? `Expected object not to match schema`
        : `Expected object to match schema. Errors: ${result.errors.join('; ')}`,
    };
  },
};

/**
 * Async assertion helpers
 */

/**
 * Assert that a promise resolves within a timeout
 * @param promise - Promise to check
 * @param timeout - Timeout in milliseconds
 * @returns Assertion result
 */
export async function assertResolvesWithin<T>(
  promise: Promise<T>,
  timeout: number
): Promise<{ resolved: boolean; value?: T; error?: Error }> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Timeout')), timeout);
  });

  try {
    const value = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return { resolved: true, value };
  } catch (error) {
    clearTimeout(timeoutId!);
    return { resolved: false, error: error as Error };
  }
}

/**
 * Assert that a promise rejects with a specific error
 * @param promise - Promise to check
 * @param errorType - Expected error type or message
 * @returns Assertion result
 */
export async function assertRejectsWith(
  promise: Promise<any>,
  errorType?: string | RegExp | Function
): Promise<boolean> {
  try {
    await promise;
    return false; // Should have rejected
  } catch (error: any) {
    if (!errorType) return true; // Any rejection is valid

    if (typeof errorType === 'string') {
      return error.message === errorType;
    } else if (errorType instanceof RegExp) {
      return errorType.test(error.message);
    } else if (typeof errorType === 'function') {
      return error instanceof errorType;
    }

    return false;
  }
}