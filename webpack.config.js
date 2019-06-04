const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const DIR_SRC = path.resolve(__dirname, './src');
const DIR_BUILD = path.resolve(__dirname, './dist');

module.exports = {
  context: DIR_SRC,
  entry: [
    './index.ts',
  ],
  target: 'node',
  mode: 'production',
  externals: [nodeExternals()],
  output: {
    path: DIR_BUILD,
    filename: 'server.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      DIR_SRC,
      'node_modules',
    ],
  },
  module: {
    rules: [
      {
        sideEffects: false,
      },
      {
        enforce: 'pre',
        test: /\.(js|ts)$/,
        use: [
          {
            loader: 'tslint-loader',
            query: {
              failOnError: true,
            },
          },
        ],
      },
      {
        test: /\.(js|ts)$/,
        use: [{
          loader: 'ts-loader',
        }],
      },
    ],
  },
  plugins: [
    new ProgressBarPlugin({
      format: '[:bar]',
    }),
    new CleanWebpackPlugin(),
  ],
};
