const webpack = require('webpack');
const webpackConfig = require('../webpack.config');

Object.assign(webpackConfig, {
  externals: {},
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/(dns|net)/, 'util')
  ],
  devtool: 'inline-source-map'
});

webpackConfig.module.loaders.push({
  test: /\.js$/, include: /(joi|hoek|isemail|topo|proxy-polyfill)/, loader: 'babel'
});

module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    browsers: ['Chrome'/*, 'Firefox', 'PhantomJS'*/],
    reporters: ['mocha'],
    singleRun: true,

    files: [
      'browserSetup.js'
    ],

    preprocessors: {
      'browserSetup.js': ['webpack', 'sourcemap']
    },

    mochaReporter: {
      showDiff: true
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    },

    beforeMiddleware: ['webpackBlocker'],

    phantomjsLauncher: {
      exitOnResourceError: true
    }
  });
};
