import difference from 'lodash.difference';
import pull from 'lodash.pull';
import forEach from 'lodash.forEach';

function isPlainObject(obj) {
  return typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype;
}

export default function readOnly(target){
  let _readOnly = function (target, acc) {

    // acc is passed into the function to be used for observer
    let _defineProperty = function (propName, target, acc) {

      // operation to be performed when add occurred
      // have to define the added item
      let addOp = cArg => _defineProperty(cArg.name, cArg.object, acc[propName]);

      // operation to be performed when add delete
      let delOp = cArg => {
        if (isPlainObject(cArg.object)) delete acc[propName][cArg.name];
        if (Array.isArray(cArg.object)) {
          // this fixes the array
          acc[propName].unshift(acc[propName].shift());

          // when splice occures, there's no
          // clear indication what has been removed
          // so, we need to find the diff, and clear acc
          let args = difference(acc[propName], cArg.object);
          args.unshift(acc[propName]);
          pull.apply(null, args);
        }
      };

      // function that is called when any change in the property happens
      let observeFn = changes => changes.map((change, i) => {
        switch (change.type) {
        case 'new': addOp(change); break;
        case 'deleted': delOp(change); break;
        }
      });

      if (Array.isArray(target[propName])) {
        Object.defineProperty(acc, propName, {
          configurable: true,
          enumerable: true,
          value: []
        });
        Object.observe(target[propName], observeFn);
        _readOnly(target[propName], acc[propName]);
      } else if (isPlainObject(target[propName])) {
        Object.defineProperty(acc, propName, {
          configurable: true,
          enumerable: true,
          value: {}
        });
        Object.observe(target[propName], observeFn);
        _readOnly(target[propName], acc[propName]);
      } else { // value is the primitive one
        Object.defineProperty(acc, propName, {
          configurable: true,
          enumerable: true,
          get: function () {
            return target[propName];
          }
        });
      }
    };

    // target is an array
    forEach(target, (val, key) => _defineProperty(key, target, acc));

    return acc;
  };

  if (Array.isArray(target)) return _readOnly(target, []);
  return _readOnly(target, {});
}
