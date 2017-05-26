import React from 'react'
import { render } from 'react-dom'
import { createStore, ReduxableSet } from 'reduxable'
import { Provider } from 'react-redux'
import App from './components/App'
import TodoApp from './reduxables'

const app = new ReduxableSet({
  todoApp1: new TodoApp(),
  todoApp2: new TodoApp(),
})

const store = createStore(app)

render(
  <Provider store={store}>
    <div>
      <App todoApp={app.todoApp1} />
      <App todoApp={app.todoApp2} />
    </div>
  </Provider>,
  document.getElementById('root'),
)
