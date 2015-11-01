module.exports = {
  'default': {
    presets: ['es2015']
  },
  es6: {
    plugins: [
      'transform-es2015-modules-commonjs',
      'transform-strict-mode'
    ]
  }
};
