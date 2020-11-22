const path = require('path');
const nodeExternals = require('webpack-node-externals');

/**
 * [1] To ignore built-in modules like path, fs, etc.
 * this makes sure we include node_modules and other 3rd party libraries
 * [2] To ignore all modules in node_modules folder
 * [3] To prevent webpack from injecting __dirname which would replace __dirname from node
 */
module.exports = {
  entry: { server: path.join(__dirname, 'server', 'bin', 'www.ts') },
  resolve: { extensions: ['.js', '.ts'] },
  target: 'node', // [1]
  externals: [nodeExternals()], // [2]
  node: { // [3]
    __dirname: false,
    __filename: false,
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
};
