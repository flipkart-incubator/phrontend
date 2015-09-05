import Dispatcher from '../src/AppDispatcher.js';

describe('AppDispatcher', function() {
  it('should accept only string actionTypes', function() {
    expect(()=>Dispatcher.dispatch(123)).to.throw(Error);
  });
  it('should dispatch actions in format dispatch(<string> Action, <object>[optional] Payload)', function() {
    var registeredFn = function() {};
    var spyFn = spy(registeredFn);
    Dispatcher.register(spyFn);
    Dispatcher.dispatch('SomeAction', {});
    expect(spyFn).to.have.been.called();
  });
});
