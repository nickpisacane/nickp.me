module.exports = Object.assign({}, require('./webpack.config.dev'), {
  mode: 'production',
  devtool: undefined,
});
