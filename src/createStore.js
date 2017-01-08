import Reduxion from '..'
import { createStore } from 'redux'

/**
 * Creates a Redux store that holds the state tree.
 *
 * The only difference with Redux's `createStore` is that it also recognizes
 * the Reduxion instances getting its reducers.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

export default function createStoreWithReduxions(reducer, ...args) {
  // TODO: check for Reduxion inhetirance properly
  if (reducer.getReducer) {
    reducer = reducer.getReducer()
  }
  return createStore(reducer, ...args)
}