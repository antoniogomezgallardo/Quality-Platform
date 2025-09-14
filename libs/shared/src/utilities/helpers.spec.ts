/**
 * Unit tests for utility helpers
 */

import {
  slugify,
  deepClone,
  debounce,
  throttle,
  retry,
  sleep,
  randomString,
  generateUUID,
  pick,
  omit,
  isEmpty,
  groupBy,
  chunk,
  flatten,
} from './helpers';

describe('Utility Helpers', () => {
  describe('slugify', () => {
    it('should create URL-safe slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('This is a Test!')).toBe('this-is-a-test');
      expect(slugify('Special Characters @#$%')).toBe('special-characters');
    });

    it('should respect custom options', () => {
      expect(slugify('Hello World', { separator: '_' })).toBe('hello_world');
      expect(slugify('Hello World', { lowercase: false })).toBe('Hello-World');
      expect(slugify('Very Long Text That Should Be Truncated', { maxLength: 10 })).toBe('very-long');
    });
  });

  describe('deepClone', () => {
    it('should deep clone objects', () => {
      const original = {
        name: 'test',
        nested: { value: 123 },
        array: [1, 2, { deep: true }],
        date: new Date('2024-01-01'),
      };

      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.nested).not.toBe(original.nested);
      expect(cloned.array).not.toBe(original.array);
      expect(cloned.date).not.toBe(original.date);
    });

    it('should handle primitive values', () => {
      expect(deepClone('string')).toBe('string');
      expect(deepClone(123)).toBe(123);
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const fn = jest.fn();
      const debouncedFn = debounce(fn, 100);

      // Call multiple times rapidly
      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(fn).not.toHaveBeenCalled();

      // Wait for debounce delay
      await sleep(150);

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const fn = jest.fn();
      const throttledFn = throttle(fn, 100);

      // First call should execute immediately
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);

      // Subsequent calls within limit should be ignored
      throttledFn();
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);

      // Wait for throttle limit
      await sleep(150);

      // Next call should execute
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('retry', () => {
    it('should retry failed operations', async () => {
      let attempts = 0;
      const failingFn = jest.fn(async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Failed');
        }
        return 'success';
      });

      const result = await retry(failingFn, 3, 10);

      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    it('should throw after max retries', async () => {
      const alwaysFailingFn = jest.fn(async () => {
        throw new Error('Always fails');
      });

      await expect(retry(alwaysFailingFn, 2, 10)).rejects.toThrow('Always fails');
      expect(alwaysFailingFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('sleep', () => {
    it('should sleep for specified duration', async () => {
      const start = Date.now();
      await sleep(100);
      const duration = Date.now() - start;

      expect(duration).toBeGreaterThanOrEqual(90); // Allow some tolerance
      expect(duration).toBeLessThan(200);
    });
  });

  describe('randomString', () => {
    it('should generate random strings', () => {
      const str1 = randomString();
      const str2 = randomString();

      expect(str1).toHaveLength(10); // Default length
      expect(str2).toHaveLength(10);
      expect(str1).not.toBe(str2); // Should be different
    });

    it('should respect custom length', () => {
      const str = randomString(20);
      expect(str).toHaveLength(20);
    });

    it('should use custom charset', () => {
      const str = randomString(10, '123');
      expect(/^[123]+$/.test(str)).toBe(true);
    });
  });

  describe('generateUUID', () => {
    it('should generate valid UUID v4', () => {
      const uuid = generateUUID();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      expect(uuidRegex.test(uuid)).toBe(true);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();

      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('pick', () => {
    it('should pick specified properties', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const picked = pick(obj, ['a', 'c']);

      expect(picked).toEqual({ a: 1, c: 3 });
      expect('b' in picked).toBe(false);
      expect('d' in picked).toBe(false);
    });
  });

  describe('omit', () => {
    it('should omit specified properties', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const omitted = omit(obj, ['b', 'd']);

      expect(omitted).toEqual({ a: 1, c: 3 });
      expect('b' in omitted).toBe(false);
      expect('d' in omitted).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should detect empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    it('should detect non-empty values', () => {
      expect(isEmpty('text')).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty({ key: 'value' })).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });
  });

  describe('groupBy', () => {
    it('should group array items by key', () => {
      const items = [
        { category: 'A', name: 'item1' },
        { category: 'B', name: 'item2' },
        { category: 'A', name: 'item3' },
      ];

      const grouped = groupBy(items, 'category');

      expect(grouped).toEqual({
        A: [
          { category: 'A', name: 'item1' },
          { category: 'A', name: 'item3' },
        ],
        B: [
          { category: 'B', name: 'item2' },
        ],
      });
    });
  });

  describe('chunk', () => {
    it('should chunk array into smaller arrays', () => {
      const array = [1, 2, 3, 4, 5, 6, 7];
      const chunks = chunk(array, 3);

      expect(chunks).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });
  });

  describe('flatten', () => {
    it('should flatten nested arrays', () => {
      const nested = [1, [2, 3], [4, [5, 6]], 7];
      const flattened = flatten(nested);

      expect(flattened).toEqual([1, 2, 3, 4, [5, 6], 7]);
    });

    it('should respect depth parameter', () => {
      const nested = [1, [2, [3, [4, 5]]]];
      const flattened = flatten(nested, 2);

      expect(flattened).toEqual([1, 2, 3, [4, 5]]);
    });
  });
});