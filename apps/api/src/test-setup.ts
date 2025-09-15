// Global test setup for API tests

// Set test timeout
jest.setTimeout(10000);

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_URL = 'file:./test.db';

// Global test utilities
global.beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

// Suppress console output in tests unless specifically needed
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});