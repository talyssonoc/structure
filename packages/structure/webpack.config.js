const path = require('path');

module.exports = {
  mode: 'production',
  entry: [path.join(__dirname, 'src/index.js')],
  output: {
    filename: './structure.js',
    library: 'Structure',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  externals: {
    '@hapi/joi': {
      root: 'joi',
      commonjs: '@hapi/joi',
      commonjs2: '@hapi/joi',
      amd: 'joi',
    },
    lodash: {
      root: '_',
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            ['@babel/plugin-proposal-object-rest-spread', { loose: true, useBuiltIns: true }],
          ],
        },
      },
    ],
  },
};
