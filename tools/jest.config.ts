/* eslint-disable */
export default {
  displayName: 'tools',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/tools',
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/bin/**/*'
  ],
  testMatch: [
    '<rootDir>/src/**/*.(test|spec).{ts,js}',
    '<rootDir>/src/**/__tests__/**/*.{ts,js}'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts']
};