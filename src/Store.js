import AppDispatcher from './AppDispatcher';
import {EventEmitter2} from 'eventemitter2';

export default class Store extends EventEmitter2 {
  // to be compatible with the existing phrontend
  static create(...args) {
    return new Store(...args);
  }
  constructor({initialState = {}, handler}) {
    super();
    this.state = initialState;

    this.dispatcher = AppDispatcher;
    this.dispatchToken = AppDispatcher.register(handler.bind(this));
  }
  get(attr) {
    return attr ? this.state[attr] : this.toJSON();
  }
  set(attr, val) {
    if (typeof attr === 'object') this.state = attr;
    else this.state[attr] = val;
  }
  // to be backward compatible
  parse(data) {
    return 'string' === typeof data ? JSON.parse(data) : data;
  }
  // to be backward compatible
  toJSON() {
    return JSON.parse(JSON.stringify(this.state));
  }
  emitChange(...data) {
    this.emit('change', ...data);
  }
  emitError(...err) {
    this.emit('err', ...err);
  }
  subscribe(success, error) {
    this.on('change', success);
    error && this.on('err', error);
  }
  unsubscribe(success, error) {
    success && this.off('change', success);
    error && this.off('err', error);
  }
}
