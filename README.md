Reduxable removes the boilerplate from Redux.

It's still based on Redux so you should know how it works before start using this library.

### Installation

To install the stable version:

```
npm install --save reduxable
```

### Motivation

Redux is great! It solves a really hard problem: **state managament**

And it does it in an elegant, easy to understand way.

> The whole state of your app is stored in an object tree inside a single *store*.
> The only way to change the state tree is to emit an *action*, an object describing what happened.
> To specify how the actions transform the state tree, you write pure *reducers*.

This comes with a lot of benefits in terms of simplicity and tools, specially **great tools**.

But there is a no less important problem. It has some boilerplate making the usage more difficult than expected. Usually, you have to write three files when you want to implement some new small behavior in your app state.

This is not only annoying but also reduces the cohesion in your code, making it more error prone and harder to understand.

```js
import { createStore } from 'redux'

/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you: it can be a primitive, an array, an object,
 * or even an Immutable.js data structure. The only important part is that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * In this example, we use a `switch` statement and strings, but you can use a helper that
 * follows a different convention (such as function maps) if it makes sense for your
 * project.
 */
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  case 'DECREMENT':
    return state - 1
  default:
    return state
  }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(counter)

// You can use subscribe() to update the UI in response to state changes.
// Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
// However it can also be handy to persist the current state in the localStorage.

store.subscribe(() =>
  console.log(store.getState())
)

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT' })
// 1
```

### Examples

* [Counter](https://github.com/underscopeio/reduxable/tree/master/examples/counter)

### Change Log

This project adheres to [Semantic Versioning](http://semver.org/).
Every release, along with the migration instructions, is documented on the Github [Releases](https://github.com/underscopeio/reduxable/releases) page.

### License

MIT
