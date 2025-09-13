const { createJestConfig } = require('@nx/jest');

module.exports = createJestConfig({
  displayName: 'quality-platform',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'apps/**/*.{ts,js}',
    'web/src/**/*.{ts,tsx,js,jsx}',
    '!apps/**/*.spec.{ts,js}',
    '!apps/**/*.test.{ts,js}',
    '!apps/**/main.ts',
    '!apps/**/environment*.ts',
    '!web/src/**/*.spec.{ts,tsx}',
    '!web/src/**/*.test.{ts,tsx}',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: [
    '<rootDir>/apps/**/*.spec.{ts,js}',
    '<rootDir>/apps/**/*.test.{ts,js}',
    '<rootDir>/web/src/**/*.spec.{ts,tsx}',
    '<rootDir>/web/src/**/*.test.{ts,tsx}',
  ],
});