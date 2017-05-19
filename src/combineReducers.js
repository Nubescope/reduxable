import { combineReducers } from 'redux'

import Reduxable from './Reduxable'

/**
 *
 * The only difference with Redux's `combineReducers` is that it also recognizes
 * the Reduxable instances getting its reducers.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */

export default function combineReducersWithReduxables(reducers) {
  // TODO: check for Reduxable inhetirance properly
  //       Don't know why `reducer.constructor.prototype instanceof Reduxable` is not working
  const newReducers = {}
  Object.keys(reducers).forEach(key => {
    const reducer = reducers[key]
    if (typeof reducer === 'function') {
      newReducers[key] = reducer
    } else {
      newReducers[key] = reducer.reduce

      if (reducer.setScope) {
        reducer.setScope(key)
      }
    }
  })

  return combineReducers(newReducers)
}
