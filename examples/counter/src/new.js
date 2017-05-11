import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'reduxable'
import Counter from './components/Counter'
import CounterReduxable from './reduxables'

const counter = new CounterReduxable()
const counter2 = new CounterReduxable()

const store = createStore(
  combineReducers({
    counter,
    counter2,
  }),
)

const rootEl = document.getElementById('root')

const render = () =>
  ReactDOM.render(
    <div>
      <Counter value={counter.getState()} onIncrement={counter.state.increment} onDecrement={counter.state.decrement} />
      <Counter
        value={counter2.getState()}
        onIncrement={counter2.state.increment}
        onDecrement={counter2.state.decrement}
      />
    </div>,
    rootEl,
  )

render()
store.subscribe(render)
