module.exports = {
  source: './public',
  target: 's3://nickp.me',
  modifiers: {
    '!*.*': {
      'Content-Type': 'text/html',
    },
  },
};
