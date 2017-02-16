import { combineReducers } from 'redux'

import Reduxion from './Reduxion'

/**
 *
 * The only difference with Redux's `combineReducers` is that it also recognizes
 * the Reduxion instances getting its reducers.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */

export default function combineReducersWithReduxions(reducers) {
  // TODO: check for Reduxion inhetirance properly
  //       Don't know why `reducer.constructor.prototype instanceof Reduxion` is not working
  const newReducers = {}
  Object.keys(reducers).forEach(key => {
    const reducer = reducers[key]
    if (reducer.setScope) {
      reducer.setScope(key)
    }

    if (reducer.getReducer) {
      newReducers[key] = reducer.getReducer()
    } else {
      newReducers[key] = reducer
    }
  })

  const reducer = combineReducers(newReducers)
  reducer.setScope = scope => {
    Object.keys(reducers).forEach(key => {
      const reducer = reducers[key]
      if (reducer.setScope) {
        reducer.setScope(`${scope}.${key}`)
      }
    })
  }
  return reducer
}