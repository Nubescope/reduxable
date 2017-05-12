/*
  *  Returns a reducer function grouping all the defined reducers
  *
  *  This method will do the following
  *    1) Find the method that matchs with the action `type`
  *    2) If the method exists, call that method with the current state and the action `payload`
  */

export default function createReducer(reducers, defaultState) {
  function reduce(state = defaultState, { type, payload } = {}) {
    const method = type && reducers[type]

    if (method) {
      return method(state, payload)
    }

    return state
  }

  return reduce
}
