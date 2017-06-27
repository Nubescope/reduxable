import React from 'react'
import ReactDOM from 'react-dom'
import Reduxable, { createStore } from 'reduxable'
import Counter from './components/Counter'
import CounterReduxable from './reduxables'

const counter = new CounterReduxable()
const counter2 = new CounterReduxable()

const store = createStore(
  new Reduxable({
    counter,
    counter2,
  }),
)

const rootEl = document.getElementById('root')

const render = () =>
  ReactDOM.render(
    <div>
      <Counter
        value={counter.state}
        onIncrement={counter.reducers.increment}
        onDecrement={counter.reducers.decrement}
      />
      <Counter
        value={counter2.state}
        onIncrement={counter2.reducers.increment}
        onDecrement={counter2.reducers.decrement}
      />
    </div>,
    rootEl,
  )

render()
store.subscribe(render)
