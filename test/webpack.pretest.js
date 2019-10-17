const path = require('path');
const webpackConfig = require('../webpack.config');

Object.assign(webpackConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    ...webpackConfig.output,
    path: path.join(__dirname, '..', 'distTest'),
  },
});

module.exports = webpackConfig;
