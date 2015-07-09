import AmpersandState from 'ampersand-state';
import isString from 'lodash.isstring';
import isArray from 'lodash.isarray';
import isUndefined from 'lodash.isundefined';
import result from 'lodash.result';

class State extends AmpersandState {
  // Overriding this function to prevent implicit setter in the view for an flux architecture.
  createPropertyDefinition(object, name, desc, isSession) {
    var def = object._definition[name] = {};
    var type, descArray;

    if (isString(desc)) {
      // grab our type if all we've got is a string
      type = object._ensureValidType(desc);
      if (type) def.type = type;
    } else {
      // Transform array of ['type', required, default] to object form
      if (isArray(desc)) {
        descArray = desc;
        desc = {
          type: descArray[0],
          required: descArray[1],
          'default': descArray[2]
        };
      }
      type = object._ensureValidType(desc.type);
      if (type) def.type = type;

      if (desc.required) def.required = true;

      if (desc['default'] && typeof desc['default'] === 'object') {
        throw new TypeError('The default value for ' + name + ' cannot be an object/array, must be a value or a function which returns a value/object/array');
      }

      def['default'] = desc['default'];

      def.allowNull = desc.allowNull ? desc.allowNull : false;
      if (desc.setOnce) def.setOnce = true;
      if (def.required && isUndefined(def['default']) && !def.setOnce) def['default'] = object._getDefaultForType(type);
      def.test = desc.test;
      def.values = desc.values;
    }

    if (isSession) def.session = true;

    // define a getter/setter on the prototype
    // but they get/set on the instance
    Object.defineProperty(object, name, {
      // Commenting set to prevent implicit setter in the view for an flux architecture.
      // set: function (val) {
      //     this.set(name, val);
      // },
      get: function() {
        var value = this._values[name];
        var typeDef = this._dataTypes[def.type];
        if (typeof value !== 'undefined') {
          if (typeDef && typeDef.get) {
            value = typeDef.get(value);
          }
          return value;
        }
        value = result(def, 'default');
        this._values[name] = value;
        return value;
      }
    });

    return def;
  }
}

State.extend = AmpersandState.extend;

export default State;
