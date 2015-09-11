import assign from 'object-assign';
if (!Object.assign) Object.assign = assign;

import Promise from 'bluebird';
if (!window.Promise) window.Promise = Promise;

// Fetch exposes fetch function,
// Request, Header, Response classes to window
import 'whatwg-fetch';

if (process.env.NODE_ENV !== 'production') {
  Error.stackTraceLimit = Infinity;
}
