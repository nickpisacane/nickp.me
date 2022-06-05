const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = Object.assign({}, require('./webpack.config.dev'), {
  mode: 'production',
  devtool: undefined,
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin({terserOptions: {output: {ascii_only: true}}}),
  //   ],
  // },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            // true for `ascii_only`
            ascii_only: true,
          },
        },
      }),
    ],
  },
});
