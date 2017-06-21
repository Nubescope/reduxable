import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'reduxable'
import Counter from './components/Counter'
import CounterReduxable from './reduxables'
import newReduxable from './reduxables/new-one'

const counter = new CounterReduxable()
const counter2 = new CounterReduxable()

const store = createStore(
  combineReducers({
    counter,
    counter2,
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

const rootEl = document.getElementById('root')

const render = () =>
  ReactDOM.render(
    <div>
      <Counter
        value={counter.getState()}
        onIncrement={() => counter.increment()}
        onDecrement={() => counter.decrement()}
      />
      <Counter
        value={counter2.getState()}
        onIncrement={() => counter2.increment()}
        onDecrement={() => counter2.decrement()}
      />
    </div>,
    rootEl,
  )

render()
store.subscribe(render)
