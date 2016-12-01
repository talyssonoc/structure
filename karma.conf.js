const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

webpackConfig.externals = {};
webpackConfig.plugins = [
  new webpack.NormalModuleReplacementPlugin(/(dns|net)/, 'util')
];
webpackConfig.module.loaders[0].include = /joi/;
webpackConfig.module.loaders[0].exclude = undefined;
webpackConfig.devtool = 'inline-source-map';

module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    browsers: [/*'Chrome'/*, 'Firefox',*/ 'PhantomJS'],
    reporters: ['mocha'],
    singleRun: true,

    files: [
      'test/browser.setup.js'
    ],

    preprocessors: {
      '*/**.js': ['webpack', 'sourcemap']
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
