import AppDispatcher from './AppDispatcher';
import {EventEmitter} from 'fbemitter';
import {Map as IMap, Iterable, List as IList} from 'immutable';

function isPlainObject(obj) {
  return typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype;
}

export default class Store extends EventEmitter {
  // to be compatible with the existing phrontend
  static create(...args) {
    return new Store(...args);
  }
  constructor({initialState = {}, handler}) {
    super();
    this.state = this.makeState(initialState);
    this.subscriptions = new WeakMap();

    this.dispatcher = AppDispatcher;
    this.dispatchToken = AppDispatcher.register(handler.bind(this));
  }
  makeState(o) {
    let state;
    if (Iterable.isIterable(o)) {
      if (IMap.isMap(o) || IList.isList(o)) state = o;
      else throw new Error('Only Map and List Immutable types are supported');
    } else if (Array.isArray(o)) state = new IList(o);
    else if (isPlainObject(o)) state = new IMap(o);
    else throw new Error(`
      State is ${JSON.stringify(o)}
      State can only be one of Object, Array, ImmutableMap, ImmutableList
    `);
    return state;
  }
  get(attr) {
    return attr ? this.state.get(attr) : this.toJSON();
  }
  set(attr, val) {
    this.state = this.state.set(attr, val);
  }
  // to be backward compatible
  toJSON() {
    return this.state.toObject();
  }
  emitChange(data) {
    this.emit('onchange', data);
  }
  emitError(err) {
    this.emit('onerror', err);
  }
  subscribe(success, error) {
    this.subscriptions.set(success, this.addListener('onchange', success));
    error && this.subscriptions.set(error, this.addListener('onerror', error));
  }
  unsubscribe(...events) {
    events.map(e => {
      let listener = this.subscriptions.get(e);
      listener.remove();
      this.subscriptions.delete(e);
    });
  }
}
