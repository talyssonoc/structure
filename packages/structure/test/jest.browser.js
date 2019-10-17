module.exports = {
  runner: '@jest-runner/electron',
  testEnvironment: '@jest-runner/electron/environment',
  moduleNameMapper: {
    src$: '<rootDir>/../distTest/structure.js',
  },
};
