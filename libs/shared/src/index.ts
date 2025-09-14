/**
 * Main entry point for @quality-platform/shared
 */

// Re-export all modules
export * from './validation';
export * from './utilities';
export * from './test-helpers';

/**
 * Library metadata
 */
export const LIBRARY_INFO = {
  name: '@quality-platform/shared',
  version: '0.1.0',
  description: 'Shared libraries for Quality Platform',
  author: 'Quality Platform Team',
  license: 'MIT',
} as const;