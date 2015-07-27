import AppDispatcher from './AppDispatcher';

export default class Store {
  static create(options) {

    let instance = options.state ? new options.state() : new options.collection();

    instance.emitChange = (data) => {
      instance.trigger('onChange', data);
    };

    instance.subscribe = (successCallback, errorCallback) => {
      instance.on('onChange', successCallback);
      errorCallback && instance.on('onError', errorCallback);
    };

    instance.unsubscribe = (successCallback, errorCallback) => {
      successCallback && instance.off('onChange', successCallback);
      errorCallback && instance.off('onError', errorCallback);
    };

    instance.emitError = (err) => {
      instance.trigger('onError', err);
    };

    let _get = instance.get;

    instance.get = (attr) => {
      return attr ? _get.call(instance, attr) : instance.toJSON();
    };

    instance.dispatcher = AppDispatcher;

    instance.dispatchToken = AppDispatcher.register(options.handler.bind(instance));

    return instance;
  }
}
