import AppDispatcher from './AppDispatcher';
import {EventEmitter} from 'fbemitter';

export default class Store extends EventEmitter {
  // to be compatible with the existing phrontend
  static create(...args) {
    return new Store(...args);
  }
  constructor({initialState = {}, handler}) {
    super();
    this.state = initialState;
    this.subscriptions = new WeakMap();

    this.dispatcher = AppDispatcher;
    this.dispatchToken = AppDispatcher.register(handler.bind(this));
  }
  get(attr) {
    return attr ? this.state[attr] : this.toJSON();
  }
  set(attr, val) {
    this.state[attr] = val;
  }
  // to be backward compatible
  toJSON() {
    return JSON.parse(JSON.stringify(this.state));
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
