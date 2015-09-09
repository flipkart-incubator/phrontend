# Phrontend

[![Build Status](https://travis-ci.org/flipkart-incubator/phrontend.svg?branch=master)](https://travis-ci.org/flipkart-incubator/phrontend)
[![Code Climate](https://codeclimate.com/github/flipkart-incubator/phrontend/badges/gpa.svg)](https://codeclimate.com/github/flipkart-incubator/phrontend)
[![Test Coverage](https://codeclimate.com/github/flipkart-incubator/phrontend/badges/coverage.svg)](https://codeclimate.com/github/flipkart-incubator/phrontend/coverage)

Framework to build rich UIs.

Phrontend is a [flux](https://facebook.github.io/flux) implementation.

## Install

```sh
npm install phrontend --save
```

## Dependencies

From npm@3, you must install `react` and `react-router` manually. (https://github.com/npm/npm/releases/tag/v3.0.0 - Peer dependencies are no longer implicitly installed).

`Optional` - [phrontend-webpack](https://github.com/flipkart-incubator/phrontend-webpack) - a webpack config maker customized for phrontend apps.

## Basic Usage

Let's create a simple counter application.

#### ActionTypes.js
Defining the action types.
```js
export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';
```

#### CounterActionCreator.js

Let's create the action creators for the defined actions.

```js
import {Dispatcher} from 'phrontend';
import {INCREMENT_COUNTER, DECREMENT_COUNTER} from './ActionTypes';

export let increment = step => Dispatcher.dispatch(INCREMENT_COUNTER, step);
export let decrement = step => Dispatcher.dispatch(DECREMENT_COUNTER, step);
```

#### CounterStore.js

```js
import {Store} from 'phrontend';
import {INCREMENT_COUNTER, DECREMENT_COUNTER} from './ActionTypes';

const initialState = {
  count: 0
};

class CounterStore extends Store {
  handler(payload) {
    switch(payload.actionType) {
      case INCREMENT_COUNTER:
        // increment the counter to the absolute value of the data sent
        this.set('count', this.get('count') + payload.data);
        // and emit the change event for the subscribers (views) to update themselves
        this.emitChange();
        break;
      case DECREMENT_COUNTER:
        this.set('count', this.get('count') - payload.data);
        this.emitChange();
    }
  }
}

export default new CounterStore(initialState);
```


#### CounterComponent.js

```js
import React from 'react';
import CounterStore from './CounterStore';
import {increment, decrement} from './CounterActionCreator';

export default class extends React.Component {
  constructor(...args) {
    super(...args);
    this.handleChange = this.handleChange.bind(this);
    this.handleStepChange = this.handleStepChange.bind(this);
    this.state = {
      step: 1,
      count: 0,
    }
  }
  componentDidMount() {
    // subscribe to the change events published by the store this view
    // wants to listen to
    CounterStore.subscribe(this.handleChange);
  }
  componentWillUnmount() {
    // cleanup - unsubscribe from the store
    CounterStore.unsubscribe(this.handleChange);
  }
  // handle the change emitted by the store
  handleChange() {
    this.setState({
      // .get is synchronous
      count: CounterStore.get('count')
    });
  }
  handleStepChange(e) {
    // this is to maintain the step value
    this.setState({
      step: e.target.value ? parseInt(e.target.value) : 0
    });
  }
  render() {
    return <div>
      Current Value: {this.state.count}
      <div>
        <button style={buttonStyle} onClick={decrement.bind(null, this.state.step)}>-</button>
        <button style={buttonStyle} onClick={increment.bind(null, this.state.step)}>+</button>
      </div>
      <div>Step : <input onChange={this.handleStepChange} value={this.state.step}/></div>
    </div>;
  }
}
```

#### App.js

```js
import React from 'react';
import CounterComponent from './CounterComponent';

window.addEventListener('DOMContentLoaded', function() {
    //Append the component to the container
  React.render(<CounterComponent/>, document.getElementById('container'));
});

```

+ Check the complete source code here [phrontend-counter](https://github.com/boopathi/phrontend-counter)

+ For an advanced example with async flux stores & [phrontend-webpack](https://github.com/flipkart-incubator/phrontend-webpack), Check out [phrontend-example](https://github.com/vigneshshanmugam/phrontend-example)

## LICENSE

Copyright 2015 Flipkart Internet Pvt. Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
