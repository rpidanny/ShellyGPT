// import type { Config } from 'jest';
import { defaults } from 'jest-config';
import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: defaults.testRegex,
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'jest-environment-node',
  testPathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/tmp/',
    '<rootDir>/node_modules/',
    '<rootDir>/local_tests/',
  ],
  testTimeout: 20_000,
  setupFiles: ['<rootDir>/test/helpers/init.js'],
};

export default config;
