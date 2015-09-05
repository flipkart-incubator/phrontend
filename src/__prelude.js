import assign from 'object-assign';
if (!Object.assign) Object.assign = assign;

// Fetch exposes fetch function,
// Request, Header, Response classes to window
import 'whatwg-fetch';

const __DEV__ = (process.env.NODE_ENV !== 'production');
const __PROD__ = !__DEV__;

if (__DEV__) {
  Error.stackTraceLimit = Infinity;
}
