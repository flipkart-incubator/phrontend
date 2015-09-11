// Prelude
if (process.env.NODE_ENV !== 'production') {
  Error.stackTraceLimit = Infinity;
}

import ApiCaller from './ApiCaller';
import ApiError from './ApiError';
import Dispatcher from './AppDispatcher';
import NetworkError from './NetworkError';
import Store from './Store';

export {ApiCaller};
export {ApiError};
export {Dispatcher};
export {NetworkError};
export {Store};

// deprecated notice
const deprecatedNotice =
  `ampersand-state and ampersand-collection are removed from phrontend
  Please use v0.0.3 to use ampersand-state and ampersand-collection`;

let dummyConstructor = function() {
  if (process.env.NODE_ENV !== 'production') console.error(deprecatedNotice);
  return {};
};

export let State = {
  extend() {
    return dummyConstructor;
  }
};

export let Collection = {
  extend() {
    return dummyConstructor;
  }
};
