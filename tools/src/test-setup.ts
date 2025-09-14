// Test setup for tools package

// Mock console methods to avoid cluttering test output
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Mock console methods by default - tests can override if needed
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  // Restore console methods
  jest.restoreAllMocks();
});

// Utility function to enable console output in specific tests
export function enableConsole() {
  (console.log as jest.MockedFunction<typeof console.log>).mockImplementation(originalConsoleLog);
  (console.error as jest.MockedFunction<typeof console.error>).mockImplementation(originalConsoleError);
  (console.warn as jest.MockedFunction<typeof console.warn>).mockImplementation(originalConsoleWarn);
}

// Utility function to capture console output
export function captureConsole() {
  const logs: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  (console.log as jest.MockedFunction<typeof console.log>).mockImplementation((...args) => {
    logs.push(args.join(' '));
  });
  (console.error as jest.MockedFunction<typeof console.error>).mockImplementation((...args) => {
    errors.push(args.join(' '));
  });
  (console.warn as jest.MockedFunction<typeof console.warn>).mockImplementation((...args) => {
    warnings.push(args.join(' '));
  });

  return { logs, errors, warnings };
}