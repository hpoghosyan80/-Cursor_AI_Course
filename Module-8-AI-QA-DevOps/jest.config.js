/** @type {import('jest').Config} */
export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/qa/tests/jest'],
  setupFilesAfterEnv: ['<rootDir>/qa/tests/jest/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../Module-6-AI-Frontend-Development/src/$1',
    '\\.(css|less|scss)$': '<rootDir>/qa/tests/jest/styleMock.js',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/qa/tests/jest/tsconfig.json',
        useESM: false,
      },
    ],
  },
  collectCoverageFrom: [
    '../Module-6-AI-Frontend-Development/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
  coverageDirectory: 'qa/reports/jest-coverage',
};
