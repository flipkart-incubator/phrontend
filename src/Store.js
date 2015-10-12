import AppDispatcher from './AppDispatcher';
import EventEmitter from 'eventemitter3';

const CHANGE = 'change';
const ERROR = 'error';
const STATE = 'state';

let clone = o => JSON.parse(JSON.stringify(o));

export default class Store extends EventEmitter {
  constructor(initialState = {}) {
    super();

    // Store to be used only as an Abstract class
    if (this.constructor === Store)
      throw new Error('Store is an abstract class');

    this[STATE] = initialState;
    this.handler = this.handler.bind(this);

    this.dispatcher = AppDispatcher;
    this.dispatchToken = AppDispatcher.register(this.handler);
  }
  /*
   * State APIs
   */
  get(attr) {
    return attr ? this[STATE][attr] : this[STATE];
  }
  set(attr, val) {
    if (typeof attr === 'object') Object.assign(this[STATE], attr);
    else this[STATE][attr] = val;
  }
  parse(data) {
    return typeof data === 'string' ? JSON.parse(data) : data;
  }
  toJSON() {
    return clone(this[STATE]);
  }
  emitChange(data) {
    this.emit(CHANGE, data);
  }
  emitError(err) {
    this.emit(ERROR, err);
  }
  /*
   * Store APIs
   */
  subscribe(success, error) {
    this.on(CHANGE, success);
    error && this.on(ERROR, error);
  }
  unsubscribe(success, error) {
    success && this.removeListener(CHANGE, success);
    error && this.removeListener(ERROR, error);
  }

  // for backward compatibility
  static create(opts) {
    let actualHandler = opts.handler;
    if (process.env.NODE_ENV !== 'production') console.warn(
`Store has moved to a new API. Store.create() will be deprecated. Use
import {Store} from 'phrontend';
class MyStore extends Store {
  handler(payload) { }
}
let store = new MyStore(initialState);
`);
    class MyStore extends Store {
      handler(payload) {
        actualHandler.call(this, payload);
      }
    }
    return new MyStore();
  }
}
