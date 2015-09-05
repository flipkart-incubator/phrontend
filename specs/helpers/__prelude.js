import assign from 'object-assign';
if (!Object.assign) Object.assign = assign;

const __DEV__ = (process.env.NODE_ENV !== 'production');
const __PROD__ = !__DEV__;

if (__DEV__) {
  Error.stackTraceLimit = Infinity;
}

/*
* Mocks below this
*/

// Fetch
global.fetch = function(url, options) {
  return new Promise(function(resolve, reject) {
    var code = /[0-9]+/.exec(url);
    if (code) {
      resolve({
        'status': parseInt(code[0]),
        'json': function() {
          return Promise.resolve({
            'url': url,
            'method': options.method,
            'options': options,
            'body': options.body
          });
        }
      });
    } else {
      if (/err/.exec(url)) {
        reject(new Error('Generic Error'));
      }
      reject(new TypeError('Failed to fetch'));
    }
  });
};
