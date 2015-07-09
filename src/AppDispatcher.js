import {Dispatcher as _Dispatcher} from 'flux';

var Dispatcher = new _Dispatcher();

var _dispatch = Dispatcher.dispatch.bind(Dispatcher);

Dispatcher.dispatch = function(actionType, data = {}) {
  if (typeof actionType === 'string'){
    return _dispatch({
      actionType: actionType,
      data: data
    });
  }
  throw new Error('Dispatcher: actionType is not a String.');
};

export default Dispatcher;
