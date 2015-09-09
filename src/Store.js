import AppDispatcher from './AppDispatcher';
import EventEmitter from 'eventemitter3';

const CHANGE = 'change';
const ERROR = 'error';

export default class Store extends EventEmitter {
  constructor(initialState = {}) {
    super();

    // Store to be used only as an Abstract class
    if (this.constructor === Store)
      throw new Error('Store is an abstract class');

    this.state = initialState;
    this.handler = this.handler.bind(this);

    this.dispatcher = AppDispatcher;
    this.dispatchToken = AppDispatcher.register(this.handler);
  }
  /*
   * State APIs
   */
  get(attr) {
    return attr ? this.state[attr] : this.state;
  }
  set(attr, val) {
    if (typeof attr === 'object') Object.assign(this.state, attr);
    else this.state[attr] = val;
  }
  parse(data) {
    return typeof data === 'string' ? JSON.parse(data) : data;
  }
  toJSON() {
    return JSON.parse(JSON.stringify(this.state));
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
