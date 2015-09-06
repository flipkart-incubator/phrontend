import AppDispatcher from './AppDispatcher';
import {EventEmitter2} from 'eventemitter2';
import cloneDeep from 'lodash.cloneDeep';
import readOnly from './read-only';
import difference from 'lodash.difference';

export function createStore(handler, initialState) {
  let store = {};
  let state = {};

  // value is the actual state value
  let rwValue = cloneDeep(initialState);
  let value = readOnly(rwValue);

  let emitter = new EventEmitter2();

  // get is accessible in store as well as state
  let get = attr => attr ? value[attr] : value;
  let dispatcher = AppDispatcher;
  let dispatcherToken = AppDispatcher.register(payload => {
    handler(payload, state);
  });

  /**
   * State properties
   * ones that are accessible inside handler
   * get, set, emitChange, emitError, dispatcher, dispatcherToken
   */
  state.get = get;
  state.set = (attr, val) => {
    if (typeof attr === 'object') {
      Object.assign(rwValue, attr);
    } else {
      let shouldForceUpdate = !Object.prototype.hasOwnProperty.call(rwValue, attr);
      rwValue[attr] = val;
      if (shouldForceUpdate) value = readOnly(rwValue);
    }
    Platform.performMicrotaskCheckpoint();
  };
  state.emitChange = data => emitter.emit('change', data);
  state.emitError = err => emitter.emit('err', err);
  state.dispatcher = dispatcher;
  state.dispatcherToken = dispatcherToken;

  /**
   * Store properties
   * ones that are accessible in view or anywhere else in app
   * get, subscribe, unsubscribe, dispatcher, dispatcherToken
   */
  store.get = get;
  store.subscribe = (success, error) => {
    emitter.on('change', success);
    error && emitter.on('err', error);
  };
  store.unsubscribe = (success, error) => {
    success && emitter.off('change', success);
    error && emitter.off('err', error);
  };
  store.dispatcher = dispatcher;
  store.dispatchToken = dispatcherToken;

  return store;
}
