const webpackConfig = require('../webpack.config');

Object.assign(webpackConfig, {
  externals: {},
  resolve: {
    alias: {
      joi: 'joi-browser',
    },
  },
  devtool: 'inline-source-map',
});

module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    browsers: ['Chrome'],
    // browsers: ['Firefox'],
    reporters: ['mocha'],
    singleRun: true,

    files: ['browserSetup.js'],

    preprocessors: {
      'browserSetup.js': ['webpack', 'sourcemap'],
    },

    mochaReporter: {
      showDiff: true,
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true,
    },

    beforeMiddleware: ['webpackBlocker'],

    phantomjsLauncher: {
      exitOnResourceError: true,
    },
  });
};
