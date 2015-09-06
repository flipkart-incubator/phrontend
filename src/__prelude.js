import assign from 'object-assign';
if (!Object.assign) Object.assign = assign;

// Object.observe
// shim it with Polymer/ObjectObserver if not present
import {ObjectObserver} from 'observe-js';
if (!Object.observe && ObjectObserver) {
  Object.observe = function(model, changeHandler) {
    var ch = changeHandler, m = model;
    var observer = new ObjectObserver(m);
    observer.open(function(added, removed, changed, getOldValueFn) {
      var changes = [];
      Object.keys(added).forEach(property => changes.push({
        object: m,
        type: 'add',
        name: property,
        oldValue: void 0
      }));
      Object.keys(removed).forEach(property => changes.push({
        object: m,
        type: 'delete',
        name: property,
        oldValue: getOldValueFn(property)
      }));
      Object.keys(changed).forEach(property => changes.push({
        object: m,
        type: 'update',
        name: property,
        oldValue: getOldValueFn(property)
      }));
      ch(changes);
    });
  };
}

// Fetch exposes fetch function,
// Request, Header, Response classes to window
import 'whatwg-fetch';

const __DEV__ = (process.env.NODE_ENV !== 'production');
const __PROD__ = !__DEV__;

if (__DEV__) {
  Error.stackTraceLimit = Infinity;
}
