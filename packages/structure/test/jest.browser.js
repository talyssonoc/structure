module.exports = {
  runner: '@jest-runner/electron',
  testEnvironment: '@jest-runner/electron/environment',
  setupFilesAfterEnv: ['<rootDir>/support/setup.js'],
  moduleNameMapper: {
    src$: '<rootDir>/../distTest/structure.js',
  },
};
