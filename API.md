# API

## Polyfill

Phrontend depends on few of the latest browser features like,

+ fetch
+ Promise
+ Object.assign

Polyfill for these things is only on demand and is not done automatically. To polyfill things that Phrontend assumes to be present, you can do,

```js
import 'phrontend/lib/polyfill';
```

at the beginning of your application.

## Disptacher

Phrontend uses [facebook's dispatcher](https://github.com/facebook/flux/blob/master/src/Dispatcher.js) and follows the concept of a single dispatcher. All actions are dispatched via this dispatcher.

The `Dispatcher` exposed from Phrontend is a singleton.

```js
import {Dispatcher} from 'phrontend';
```

### Methods

#### `.dispatch(actionType : <String>, data : <Any>) : void`

+ dispatches an action of type `actionType` with the payload `data`

For all other methods, refer [Facebook's dispatcher docs](https://facebook.github.io/flux/docs/dispatcher.html).

## Store

```js
import {Store} from 'phrontend';
```

Store is an abstract class. Your application Store extends this base `Store` and defines a method `handler` with the following signature

```js
handler(payload : <Object>{ actionType : <String>, data : <Any> }) : void
```

This handler is registered to the AppDispatcher, and will be called whenever the dispatcher receives an action.

#### Example

```js
class MyStore extends Store {
  handler(payload) {}
}
```

### Methods

#### `get( key : <String | Number | void> ) : Any`

+ `get()` returns entire state object
+ `get('foo')` returns `state['foo']`
+ `get(5)` returns `state[5]` - used for Lists

#### `set( key : <Object | String | Number>, value : <Any> ) : void`

+ `set('foo', 'bar')` does `state['foo'] = 'bar'`
+ `set({ foo: 'bar' })` does the same thing. Use this for setting multiple items together

#### `parse( data : <Object | String>) : <Object>`

+ parses only String using JSON.parse
+ Override in your Store definition to parse API responses in a custom manner

#### `subscribe( successHandler : <Function>, errorHandler : <Function> ) : void`

+ Listen to change event using successHandler
+ Listen to error event using errorHandler

#### `unsubscribe( successHandler : <Function>, errorHandler : <Function> ) : void`

+ Unlisten successHandler from the change event
+ Unlisten errorHandler from the error event

#### `emitChange( data : <Any> )`

+ emit a change event to all subscribers of the store instance

#### `emitError( err : <Error> )`

+ emit an error event to all subscribers of the store instance

#### `dispatcher`

+ Reference to the AppDispatcher's instance

#### `dispatchToken`

+ The store's dispatchToken. Use this to inform dispatcher.waitFor in other Stores

## ApiCaller

ApiCaller is a singleton that uses [whatwg-fetch](https://github.com/github/fetch) to
