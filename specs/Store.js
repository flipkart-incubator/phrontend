import Store from '../src/Store.js';
import Dispatcher from '../src/AppDispatcher';

// mocked state and collection
import {State, Collection} from '../src/index.js';

let noop = () => {};

describe('Store', function() {
  it('should define a static create method', function () {
    expect(Store.create).to.be.a('function');
  });

  it('should throw error if called as a function', function() {
    expect(Store).to.throw(TypeError);
  });

  describe('StoreInstance', function() {
    var stateInstance, collectionInstance, storeInstance, storeCollectionInstance;

    stateInstance = State.extend({
      props: {
        name: 'string',
        age: 'number'
      }
    });

    collectionInstance = Collection.extend({
      model: stateInstance
    });

    storeInstance = Store.create({
      state: stateInstance,
      handler: function(payload) {
        switch (payload.actionType) {
        case 'SomeAction':
          this.set(this.parse(payload.data));
          this.emitChange();
          break;
        }
      }
    });

    storeCollectionInstance = Store.create({
      collection: collectionInstance,
      handler: function(payload) {

      }
    });

    it('should have basic functions and properties defined', function() {
      expect(storeInstance.emitChange).to.be.a('function');
      expect(storeInstance.emitError).to.be.a('function');
      expect(storeInstance.subscribe).to.be.a('function');
      expect(storeInstance.unsubscribe).to.be.a('function');
      expect(storeInstance.get).to.be.a('function');
      expect(storeInstance.dispatchToken).to.be.a('string');
      expect(storeInstance.dispatcher).to.equal(Dispatcher);
    });

    describe('.emitChange(data)', function() {
      it('should emit change event on instance', function(done) {
        var changeFn = function(data) {
          expect(data).to.equal('abc');
          done();
        };
        storeInstance.on('change', changeFn);
        storeInstance.emitChange('abc');
        storeInstance.unsubscribe(changeFn);
      });
    });

    describe('.emitError(err)', function() {
      it('should emit error event on instance', function(done) {
        var errorFn = function(err) {
          expect(err).to.equal('abc');
          done();
        };
        storeInstance.on('error', errorFn);
        storeInstance.emitError('abc');
        storeInstance.unsubscribe(null, errorFn);
      });
    });

    describe('.subscribe(change, err)', function() {
      it('should take change handler as first param', function() {
        var changeFn = function(data) {
          expect(data).to.equal('data');
        };

        storeInstance.subscribe(changeFn);
        storeInstance.emitChange('data');
        storeInstance.unsubscribe(changeFn);
      });

      it('should take error handler as second param', function() {
        var errorFn = function(err) {
          expect(err).to.equal('err');
        };

        storeInstance.subscribe(noop, errorFn);
        storeInstance.emitError('err');
        storeInstance.unsubscribe(noop, errorFn);
      });
    });

    describe('.unsubscribe(change, err)', function() {
      it('should remove the change event listener', function() {
        var spyChangeFn = spy();
        storeCollectionInstance.subscribe(spyChangeFn);
        storeCollectionInstance.unsubscribe(spyChangeFn);

        storeCollectionInstance.emitChange('data');

        expect(spyChangeFn).to.not.have.been.called();
      });

      it('should remove the error event listener', function() {
        var spyErrorFn = spy();
        storeCollectionInstance.subscribe(noop, spyErrorFn);
        storeCollectionInstance.unsubscribe(noop, spyErrorFn);

        storeCollectionInstance.emitError('err');

        expect(spyErrorFn).to.not.have.been.called();
      });
    });

    describe('.get(attr)', function() {
      it('should get the attribute if passed, or get whole object if no attr passed', function(done) {
        var changeFn = function() {
          expect(storeInstance.get().name).to.equal('John Smith');
          expect(storeInstance.get().age).to.equal(40);
          expect(storeInstance.get('name')).to.equal('John Smith');
          expect(storeInstance.get('age')).to.equal(40);
          done();
        };

        storeInstance.subscribe(changeFn);
        Dispatcher.dispatch('SomeAction', { name: 'John Smith', age: 40 });

        storeInstance.unsubscribe(changeFn);
      });
    });
  });
});
