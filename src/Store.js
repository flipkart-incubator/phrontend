import AppDispatcher from './AppDispatcher';
import {EventEmitter2} from 'eventemitter2';
import cloneDeep from 'lodash.cloneDeep';

function deepFreeze(o) {
  let props = Object.getOwnPropertyNames(o);
  props.forEach(name => {
    let prop = o[name];
    if (typeof prop === 'object' && !Object.isFrozen(prop)) deepFreeze(prop);
  });
  return Object.freeze(o);
}

export function createStore(handler, initialState) {
  let store = {};
  let state = {};

  // value is the actual state value
  let value = deepFreeze(initialState);
  let emitter = new EventEmitter2();

  // get is accessible in store as well as state
  let get = attr => attr ? value[attr] : value;

  /**
   * State properties
   * ones that are accessible inside handler
   * get, set, emitChange, emitError
   */
  state.get = get;

  // FIXME
  // should be very very slow
  // trying out a POC
  state.set = (attr, val) => {
    let newState = cloneDeep(value);
    if (typeof attr === 'object') Object.extend(newState, attr);
    else newState[attr] = val;
    value = deepFreeze(newState);
  };

  state.emitChange = data => emitter.emit('change', data);
  state.emitError = err => emitter.emit('err', err);

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

  store.dispatcher = AppDispatcher;
  store.dispatchToken = AppDispatcher.register(payload => {
    handler(payload, state);
  });

  return store;
}
