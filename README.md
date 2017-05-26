# Reduxable

Reusable Redux (and without boilerplate)

It's strongly based on Redux so you should know how it works before start using this library.

### Installation

To install the stable version:

```
npm install --save reduxable
// or
yarn add reduxable
```

### Motivation

Redux is great! It solves a really hard problem: **state managament**

And it does it in an simple, easy to understand way.

> The whole state of your app is stored in an object tree inside a single *store*.

> The only way to change the state tree is to emit an *action*, an object describing what happened.

> To specify how the actions transform the state tree, you write pure *reducers*.

This comes with a lot of benefits in terms of simplicity and tools, specially **great tools**.

But there are some issues that Redux does not solve:

- It's really difficult to reuse the code due to the global scope: the action types could collide
- We need to create a lot of boilerplate even for a tiny feature

Reduxable tackle both and aims to do it in an elegant way.

### Usage

Reduxable constructor takes the **reducers** as the first parameter and the **initial state** as the second one.
```js
const counter = new Reduxable({
  increment: state => state + 1,
  decrement: state => state - 1,
}, 0)
```

Once defined you can _**call the reducers**_ (i.e. dispatch an action), the state will be bound automatically.
```js
counter.increment()
counter.decrement()
```

### Connecting with Redux

To connect them with an existing Redux application, all you have to do is to replace the `combineReducers` and `createStore` imports to get them from `reduxable` instead of `redux`
```js
import { createStore, combineReducers } from 'reduxable'
import traditionalCounter from './reducers/counter'
import reduxableCounter from './reduxables/counter'

const mainReducer = combineReducers({
  reduxableCounter,
  traditionalCounter
})

const store = createStore(mainReducer)
```

Or if you want to go _all in_
```js
import { createStore } from 'reduxable'
import traditionalCounter from './reducers/counter'
import reduxableCounter from './reduxables/counter'

const myApp = new Reduxable({
  reduxableCounter,
  traditionalCounter
})

const store = createStore(myApp)
```

### Examples

* [Counter](https://github.com/underscopeio/reduxable/tree/master/examples/counter)
* [Todos](https://github.com/underscopeio/reduxable/tree/master/examples/todos)
* [Multiple Todos](https://github.com/underscopeio/reduxable/tree/master/examples/multiple-todos)

### Change Log

This project adheres to [Semantic Versioning](http://semver.org/).
Every release, along with the migration instructions, is documented on the Github [Releases](https://github.com/underscopeio/reduxable/releases) page.

### License

MIT
