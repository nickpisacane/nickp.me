const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  output: {
    path: path.join(__dirname, 'public', 'js'),
    filename: 'main.js',
    publicPath: '/js/',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    contentBase: [
      path.join(__dirname, 'public'),
      // to trigger reloads when css changes
      path.join(__dirname, 'public', 'css'),
    ],
    port: 8000,
    watchContentBase: true,
  },
};
