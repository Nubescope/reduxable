import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import Counter from './components/Counter'

import Reduxion from 'reduxion'
import CounterReduxion from './reduxions'
const counter = new CounterReduxion()

const store = createStore(counter.reducer)

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
