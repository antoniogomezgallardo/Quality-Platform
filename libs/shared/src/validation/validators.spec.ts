/**
 * Unit tests for validation utilities
 */

import {
  emailValidator,
  phoneValidator,
  urlValidator,
  uuidValidator,
  creditCardValidator,
  passwordValidator,
  dateValidator,
  postalCodeValidator,
} from './validators';

describe('Validation Utilities', () => {
  describe('emailValidator', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.user@company.co.uk',
        'firstname+lastname@domain.org',
        'user123@test-domain.com',
      ];

      validEmails.forEach(email => {
        expect(emailValidator(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user@.com',
        '',
        null as any,
        undefined as any,
      ];

      invalidEmails.forEach(email => {
        expect(emailValidator(email)).toBe(false);
      });
    });
  });

  describe('phoneValidator', () => {
    it('should validate correct phone numbers', () => {
      const validPhones = [
        '+1 (555) 123-4567',
        '555-123-4567',
        '+44 20 7123 4567',
        '1234567890',
        '+1234567890123',
      ];

      validPhones.forEach(phone => {
        expect(phoneValidator(phone)).toBe(true);
      });
    });

    it('should reject invalid phone numbers', () => {
      const invalidPhones = [
        '123',
        'phone-number',
        '12345',
        '',
        null as any,
        undefined as any,
      ];

      invalidPhones.forEach(phone => {
        expect(phoneValidator(phone)).toBe(false);
      });
    });
  });

  describe('urlValidator', () => {
    it('should validate correct URLs', () => {
      const validUrls = [
        'https://www.example.com',
        'http://subdomain.example.org/path',
        'https://example.com:8080/api',
        'ftp://files.example.com',
      ];

      validUrls.forEach(url => {
        expect(urlValidator(url)).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      const invalidUrls = [
        'not-a-url',
        'http://',
        '//missing-protocol.com',
        '',
        null as any,
        undefined as any,
      ];

      invalidUrls.forEach(url => {
        expect(urlValidator(url)).toBe(false);
      });
    });
  });

  describe('uuidValidator', () => {
    it('should validate correct UUID v4', () => {
      const validUuids = [
        '550e8400-e29b-41d4-a716-446655440000',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        '6ba7b810-9dad-41d1-80b4-00c04fd430c8', // Fixed to be valid v4
      ];

      validUuids.forEach(uuid => {
        expect(uuidValidator(uuid)).toBe(true);
      });
    });

    it('should reject invalid UUIDs', () => {
      const invalidUuids = [
        'not-a-uuid',
        '550e8400-e29b-41d4-a716', // Too short
        '550e8400-e29b-41d4-a716-446655440000-extra', // Too long
        '',
        null as any,
        undefined as any,
      ];

      invalidUuids.forEach(uuid => {
        expect(uuidValidator(uuid)).toBe(false);
      });
    });
  });

  describe('creditCardValidator', () => {
    it('should validate correct credit card numbers', () => {
      const validCards = [
        '4111111111111111', // Visa test card
        '5555555555554444', // Mastercard test card
        '378282246310005',  // American Express test card
      ];

      validCards.forEach(card => {
        expect(creditCardValidator(card)).toBe(true);
      });
    });

    it('should reject invalid credit card numbers', () => {
      const invalidCards = [
        '1234567890123456', // Invalid Luhn
        'not-a-card-number',
        '12345', // Too short
        '',
        null as any,
        undefined as any,
      ];

      invalidCards.forEach(card => {
        expect(creditCardValidator(card)).toBe(false);
      });
    });
  });

  describe('passwordValidator', () => {
    it('should validate strong passwords', () => {
      const strongPasswords = [
        'Password123!',
        'MyStr0ngP@ssword',
        'C0mpl3x#Pass',
      ];

      strongPasswords.forEach(password => {
        expect(passwordValidator(password)).toBe(true);
      });
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        'password', // No uppercase, numbers, special chars
        'PASSWORD123', // No lowercase
        'Password', // No numbers or special chars
        '12345678', // No letters
        'Pass1!', // Too short
        '',
        null as any,
        undefined as any,
      ];

      weakPasswords.forEach(password => {
        expect(passwordValidator(password)).toBe(false);
      });
    });

    it('should respect custom options', () => {
      const password = 'simplepass';

      // Should fail with default options
      expect(passwordValidator(password)).toBe(false);

      // Should pass with relaxed options
      expect(passwordValidator(password, {
        minLength: 6,
        requireUppercase: false,
        requireNumbers: false,
        requireSpecialChars: false,
      })).toBe(true);
    });
  });

  describe('dateValidator', () => {
    it('should validate correct dates', () => {
      const validDates = [
        new Date(),
        new Date('2024-01-01'),
        '2024-12-31T23:59:59.999Z',
      ];

      validDates.forEach(date => {
        expect(dateValidator(date)).toBe(true);
      });
    });

    it('should reject invalid dates', () => {
      const invalidDates = [
        'not-a-date',
        new Date('invalid'),
        '',
        null as any,
        undefined as any,
      ];

      invalidDates.forEach(date => {
        expect(dateValidator(date)).toBe(false);
      });
    });

    it('should respect date range options', () => {
      const futureDate = new Date(Date.now() + 86400000); // Tomorrow
      const pastDate = new Date(Date.now() - 86400000); // Yesterday

      // Should reject future dates when allowFuture is false
      expect(dateValidator(futureDate, { allowFuture: false })).toBe(false);

      // Should reject past dates when allowPast is false
      expect(dateValidator(pastDate, { allowPast: false })).toBe(false);

      // Should accept within range
      expect(dateValidator(futureDate, { allowFuture: true })).toBe(true);
      expect(dateValidator(pastDate, { allowPast: true })).toBe(true);
    });
  });

  describe('postalCodeValidator', () => {
    it('should validate correct postal codes for different countries', () => {
      const validPostalCodes = [
        { code: '12345', country: 'US' },
        { code: '12345-6789', country: 'US' },
        { code: 'SW1A 1AA', country: 'UK' },
        { code: 'M5V 3A8', country: 'CA' },
        { code: '75001', country: 'FR' },
      ];

      validPostalCodes.forEach(({ code, country }) => {
        expect(postalCodeValidator(code, country)).toBe(true);
      });
    });

    it('should reject invalid postal codes', () => {
      const invalidPostalCodes = [
        { code: 'INVALID', country: 'US' },
        { code: '12345', country: 'UNKNOWN' },
        { code: '', country: 'US' },
      ];

      invalidPostalCodes.forEach(({ code, country }) => {
        expect(postalCodeValidator(code, country)).toBe(false);
      });
    });
  });
});