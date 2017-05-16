import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'reduxable'
import { Provider } from 'react-redux'
import App from './components/App'
import reducer from './reduxables'

const store = createStore(reducer)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
