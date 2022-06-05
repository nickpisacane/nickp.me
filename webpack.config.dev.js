const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const ROOT = path.resolve(__dirname);

module.exports = {
  mode: 'development',
  // entry: './src/index.ts',
  entry: {
    main: './src/index.ts',
    channing: './src/channing/index.tsx',
  },
  devtool: 'inline-source-map',
  output: {
    path: path.join(__dirname, 'public', 'js'),
    filename: '[name].js',
    publicPath: '/js/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
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
    host: '0.0.0.0',
    before: (app, server, compiler) => {
      app.get('/channing-birthday-invite-2022', function (req, res) {
        fs.readFile(
          path.join(ROOT, 'public', 'channing-birthday-invite-2022'),
          (err, fileContents) => {
            if (err) {
              return res.status(500).end(err.message);
            }
            res.set('Content-Type', 'text/html');
            res.status(200).send(fileContents);
          },
        );
      });
    },
  },
};
