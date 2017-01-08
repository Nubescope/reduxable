import camelCase from 'lodash/camelCase'
import upperCase from 'lodash/upperCase'
import createStore from './createStore'

export default class Reduxion {
  static setStore(store) {
    this._store = store
  }

  dispatch() {
    this.constructor._store.dispatch(arguments)
  }

  getReducer() {
    return (state = this.state, action) => {
      const type = camelCase(action.type)
      const method = this.reducers[type]

      if (method) {
        return method(state, action)
      }

      return state
    }
  }

  get actions() {
    if (!this._actions) {
      this._actions = {}

      for(const reducer in this.reducers) {
        if (this.reducers.hasOwnProperty(reducer)) {
          const type = upperCase(reducer).replace(' ', '_')
          this._actions[reducer] = (action) => ({ ...action, type })
        }
      }
    }

    return this._actions
  }

  get boundedActions() {
    if (!this._boundedActions) {
      this._boundedActions = {}

      for(const reducer in this.reducers) {
        if (this.reducers.hasOwnProperty(reducer)) {
          const type = upperCase(reducer).replace(' ', '_')
          const dispatch = this.constructor._store.dispatch
          this._boundedActions[reducer] = (action) => dispatch({ ...action, type })
        }
      }
    }

    return this._boundedActions
  }
}

export {
  createStore
}