const babel = require('babel-core');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const mkdirp = require('mkdirp');
const webpack = require('webpack');
const babelquery = require('./babel-query');

const src = path.join(__dirname, '..', 'src');

function buildFile(filename, opts) {
  return new Promise((resolve, reject) => {
    babel.transformFile(path.join(src, filename), opts.query, (err, result) => {
      if (err) return reject(err);
      mkdirp.sync(opts.dest);
      let outfile = path.join(opts.dest, filename);
      fs.writeFileSync(outfile, result.code);
      resolve(outfile);
    });
  });
}

var buildlib = exports.buildlib = function() {
  let promises = glob
    .sync('**/*.js', { cwd: src })
    .map(filename => buildFile(filename, {
      dest: path.join(__dirname, '..', 'lib'),
      query: babelquery.default
    }));
  return Promise.all(promises);
};

var buildes6 = exports.buildes6 = function() {
  let promises = glob
    .sync('**/*.js', { cwd: src })
    .map(filename => buildFile(filename, {
      dest: path.join(__dirname, '..', 'es6'),
      query: babelquery.es6
    }));
  return Promise.all(promises);
};

var builddist = exports.builddist = function() {
  return new Promise((resolve, reject) => {
    webpack(require('./dist.config.js'), (err, stats) => {
      if (err) return reject(err);
      resolve(stats);
    });
  });
};

var build = exports.build = function() {
  return Promise.all([
    buildlib(),
    buildes6(),
    builddist()
  ]);
};

/* eslint-disable no-console */
function run(fn) {
  fn
    .call()
    .then(outputs => outputs.map(o => console.log(o)))
    .catch(err => {
      console.error(err);
      throw err;
    });
}

if (require.main === module) {
  let args = process.argv.slice(2);
  switch (args[0]) {
  case 'lib':
    run(buildlib);
    break;
  case 'es6':
    run(buildes6);
    break;
  case 'dist':
    run(builddist);
    break;
  default:
    run(build);
  }
}
/* eslint-enable */
