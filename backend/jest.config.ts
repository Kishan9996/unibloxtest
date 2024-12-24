import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './', // Root directory for the project
  testMatch: [
    '**/tests/**/*.test.ts', // Match all test files in `tests` folders
    '**/*.spec.ts',              // Optional: support for *.spec.ts if needed
  ],
  moduleDirectories: ['node_modules', 'src'], // Allow absolute imports from `src`
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Optional: for path alias (e.g., @/utils)
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json', // Ensure Jest uses your TS config
    },
  },
  setupFiles: ['dotenv/config'], // Load environment variables before tests
  coverageDirectory: '<rootDir>/coverage', // Output coverage reports
  collectCoverageFrom: [
    'src/**/*.{ts,js}', // Include all source files
    '!src/**/*.d.ts',   // Exclude type definitions
    '!src/tests/**', // Exclude test files
  ],
};

export default config;
