// Some babel polyfills that might be required
// import 'babel/polyfill';
import assign from 'object-assign';
if (!Object.assign) Object.assign = assign;

// Put Promise in the global scope
import BPromise from 'bluebird';
global.Promise = BPromise;

const __DEV__ = (process.env.NODE_ENV !== 'production');
const __PROD__ = !__DEV__;

if (__DEV__) {
	Promise.longStackTraces();
	Error.stackTraceLimit = Infinity;
}

/*
 * Mocks below this
 */

// Fetch
global.fetch = function(url, options) {
	return new BPromise(function(resolve, reject) {
		var code = /[0-9]+/.exec(url);
		if(code) {
			resolve({
				'status': parseInt(code[0]),
				'json': function() {
					return BPromise.resolve({
						'url': url,
						'method': options.method,
						'options': options,
						'body': options.body
					});
				}
			})
		} else {
			if(/err/.exec(url)) {
				reject(new Error('Generic Error'));
			}
			reject(new TypeError('Failed to fetch'));
		}
	});
};
