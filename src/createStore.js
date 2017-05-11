import { createStore } from 'redux'

import Reduxable from './Reduxable'

/**
 * Creates a Redux store that holds the state tree.
 *
 * The only difference with Redux's `createStore` is that it also recognizes
 * the Reduxable instances getting its reducers.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

export default function createStoreWithReduxables(reducer, ...args) {
  // TODO: check for Reduxable inhetirance properly
  //       Don't know why `reducer.constructor.prototype instanceof Reduxable` is not working
  if (reducer.getReducer) {
    reducer = reducer.getReducer()
  }

  const store = createStore(reducer, ...args)
  Reduxable.setStore(store)
  return store
}
