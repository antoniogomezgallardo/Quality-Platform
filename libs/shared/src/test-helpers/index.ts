/**
 * Test helpers module exports
 */

export * from './mocks';
export * from './fixtures';
export * from './assertions';

// Re-export commonly used test helpers
export {
  createMockUser,
  createMockProduct,
  createMockOrder,
  createMockAddress,
  createMockUsers,
  createMockProducts,
  createMockApiResponse,
  createMockTokens,
} from './mocks';

export {
  testUsers,
  testProducts,
  testOrders,
  testDataSets,
  testConfigs,
} from './fixtures';

export {
  assertEmail,
  assertUUID,
  assertISODate,
  assertHasProperties,
  assertInRange,
  assertArrayContains,
  assertArrayLength,
  assertStringMatches,
  assertMatchesSchema,
  customMatchers,
  assertResolvesWithin,
  assertRejectsWith,
} from './assertions';

// Export types
export type {
  MockUser,
  MockProduct,
  MockOrder,
  MockOrderItem,
  MockAddress,
  MockApiResponse,
} from './mocks';

export type { SchemaDefinition } from './assertions';