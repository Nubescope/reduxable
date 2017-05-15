import combineReducers from './combineReducers'
import { assertReducersObject, assertState } from './assertions'

class Reduxable {
  /*
  */

  constructor(reducers = this.constructor.reducers, state = this.constructor.state) {
    assertReducersObject(reducers)
    assertState(state)

    this._setupReducers(reducers)
    this.state = state
    this.reduce = this.getReducer()
  }

  /*
  *  The `_store` will be the Redux store. Since this store is unique by application, then we
  *  can save _statically_ and use it across all the Reduxable instances.
  *
  *  We use this store internally on two Reduxable instance methods:
  *    - `dispatch` to precisely dispatch the actions
  *    - `getState` to retrieve the portion of state corredpondent to the Reduxable instance
  *
  *  This method is called from `createStore` method. See its documentation for more details.
  */

  static setStore(store) {
    this._store = store
  }

  /*
  *  The `_scope` will define where this Reduxable instance is placed on the global state tree
  *
  *  This scope will be set as a parameter in each dispacthed action and will be used to determine
  *  whether or not an action should be catched by a reducer.
  *
  *  This method is called from `combineReducers` method. See its documentation for more details.
  */

  setScope(scope) {
    this._scope = scope
  }

  /*
  *  Returns the state for this particular scope
  *
  *  Given the following structure for a Redux store
  *
  *  const reduxStore = createStore(combineReducers({
  *    a: combineReducers({
  *      b: thisReduxableInstance
  *    })
  *  })
  *
  *  Then `thisReduxableInstance.getState()` will return `reduxStore.getState().a.b`
  */
  getState() {
    if (!this.constructor._store) {
      return this.state
    }
    let state = this.constructor._store.getState()
    if (!this._scope) {
      return state
    }

    return this._scope.split('.').reduce((object, scopeKey) => object[scopeKey], state)
  }

  /*
  *  Returns a reducer function grouping all the defined reducers
  *
  *  This method will do the following
  *    1) Check that the action `scope` match with the scope of this Reduxable instance
  *    2) Find the method that matchs with the action `type`
  *    3) Call that method with the current state and the action `payload`
  *    4) Check that the new state retrieved by that method is not the same
  *       (i.e the method did not mutate the previous state)
  */

  getReducer() {
    return (state = this.state, { type, scope, payload }) => {
      if (scope !== this._scope) {
        return state
      }

      const method = this.reducers[type]

      if (method) {
        return method(state, payload)
      } else {
        // TODO: should we show a warning here? I think this shouldn't be reached never
      }

      return state
    }
  }

  /*
  *  This method will:
  *  1) store the `reducers`
  *  2) define a method for each reducer that will call the reducer 
  *     See the `_callReducer` method for more info
  *
  */

  _setupReducers(reducers) {
    this.reducers = reducers

    // TODO: we should check there is no existing method
    for (const reducerName in reducers) {
      if (reducers.hasOwnProperty(reducerName)) {
        this[reducerName] = payload => this._callReducer(reducerName, payload)
      }
    }
  }

  /*
  *  This method will _call the reducer_ in two different ways
  *  - If it is connected to Redux, will dispatch an action for that reducer
  *  - If not, will apply the reducer directly an store the new state locally
  *
  */

  _callReducer(reducerName, payload) {
    const store = this.constructor._store

    if (store) {
      return store.dispatch({ type: reducerName, scope: this._scope, payload })
    }

    this.state = this.reducers[reducerName](this.getState(), payload)
  }
}

export default Reduxable
