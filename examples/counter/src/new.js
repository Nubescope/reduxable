import React from 'react'
import ReactDOM from 'react-dom'
import Reduxion, { createStore } from 'reduxion'
import Counter from './components/Counter'

import CounterReduxion from './reduxions'
const counter = new CounterReduxion()

const store = createStore(counter)

Reduxion.setStore(store)

const rootEl = document.getElementById('root')

const render = () => ReactDOM.render(
  <Counter
    value={store.getState()}
    onIncrement={counter.boundedActions.increment}
    onDecrement={counter.boundedActions.decrement}
  />,
  rootEl
)

render()
store.subscribe(render)
