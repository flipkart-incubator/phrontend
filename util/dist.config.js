const webpack = require('webpack');
const path = require('path');

const entry = path.join(__dirname, '..', 'src', 'index.js');
const output = {
  path: path.join(__dirname, '..', 'dist'),
  library: 'umd',
  libraryTarget: 'umd'
};
const devtool = 'sourcemap';

const babelquery = require('./babel-query');

const jsloader = {
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel'
};

// plugins
/* eslint-disable camelcase */
const minify = new webpack.optimize.UglifyJsPlugin({
  comments: false,
  compress: {
    warnings: false,
    conditionals: true,
    unused: true,
    comparisons: true,
    sequences: true,
    dead_code: true,
    evaluate: true,
    if_return: true,
    join_vars: true,
    pure_getters: true,
    unsafe: true,
    unsafe_comps: true,
    screw_ie8: true,
    properties: true
  }
});
/* eslint-enable */

const envdef = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  }
});

module.exports = [
  {
    entry,
    output: Object.assign({}, output, {
      filename: 'phrontend.js'
    }),
    devtool,
    module: {
      loaders: [
        Object.assign({}, jsloader, {
          query: babelquery.default
        })
      ]
    },
    plugins: [envdef]
  },
  {
    entry,
    output: Object.assign({}, output, {
      filename: 'phrontend.min.js'
    }),
    devtool,
    module: {
      loaders: [
        Object.assign({}, jsloader, {
          query: babelquery.default
        })
      ]
    },
    plugins: [envdef, minify]
  },
  {
    entry,
    output: Object.assign({}, output, {
      filename: 'phrontend.es6.js'
    }),
    devtool,
    module: {
      loaders: [
        Object.assign({}, jsloader, {
          query: babelquery.es6
        })
      ]
    },
    plugins: [envdef]
  }
  // UglifyJs doesn't understand es6 yet
  // https://github.com/mishoo/UglifyJS2/issues/448
  //
  // {
  //   entry,
  //   output: Object.assign({}, output, {
  //     filename: 'phrontend.es6.min.js'
  //   }),
  //   module: {
  //     loaders: [
  //       Object.assign({}, jsloader, {
  //         query: babelqueryes6
  //       })
  //     ]
  //   },
  //   plugins
  // }
];
