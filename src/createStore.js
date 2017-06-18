import { createStore } from 'redux'

import Reduxable from './Reduxable'
import GlobalReduxable from './GlobalReduxable'

/**
 * Creates a Redux store that holds the state tree.
 *
 * The only difference with Redux's `createStore` is that it also recognizes
 * the Reduxable instances getting its reducers.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

export default function createStoreWithReduxables(reduxable, ...args) {
  // TODO: check for Reduxable inhetirance properly
  //       Don't know why `reduxable.constructor.prototype instanceof Reduxable` is not working
  const reducer = typeof reduxable === 'function' ? reduxable : reduxable.reduce

  const store = createStore(reducer, ...args)
  Reduxable._setStore(store)
  GlobalReduxable._setStore(store)
  return store
}
