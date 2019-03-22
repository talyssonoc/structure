const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const alias = require('rollup-plugin-alias');

const rollupConfig = {
  output: {
    format: 'iife',
    name: 'Structure',
    sourcemap: 'inline'
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true
    }),
    commonjs({
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    alias({
      joi: 'joi-browser'
    })
  ]
};

module.exports = function (config) {
  config.set({
    frameworks: ['mocha'],
    browsers: ['Chrome'],
    // browsers: ['Firefox'],
    reporters: ['mocha'],
    singleRun: true,

    rollupPreprocessor: rollupConfig,

    files: [{ pattern: './unit/**/*.spec.js', watched: false }],

    preprocessors: {
      './unit/**/*.spec.js': ['rollup', 'sourcemap']
    },

    mochaReporter: {
      showDiff: true
    },

    phantomjsLauncher: {
      exitOnResourceError: true
    }
  });
};
