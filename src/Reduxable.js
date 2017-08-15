import combineReducers from './combineReducers'
import { assertReducersObject, assertState, assertChildName } from './assertions'

import warning from './utils/warning'

function isAReduxableSet(state) {
  if (!state || typeof state !== 'object') {
    return false
  }

  const firstChild = state[Object.keys(state)[0]]

  if (!firstChild) {
    return false
  }

  return typeof firstChild === 'function' || firstChild.__isReduxable
}

class Reduxable {
  /*
  * The Reduxable constructor receives
  * @param {any} state - Can be an object with other reduxables/reducers or any
  * @param {Object} reducers - An object with pure functions
  */

  constructor(state = this.state, reducers = this.constructor.reducers) {
    this.__isReduxable = true
    this._state = state
    this._reducers = reducers
    // TODO: call _mount when store is created
    // this._mount()
  }

  /*
  * This function will look for a `getInitialState` method and call it.
  * If it does not exists then will use the constructor's 1st parameter as the state.
  */
  _getInitialState() {
    if (typeof this.getInitialState === 'function' && this._state !== undefined) {
      throw new Error(
        "You cannot provide the state using `getInitialState` AND the constructor's 1st parameter. You must choose one of them.",
      )
    }

    const initialState = typeof this.getInitialState === 'function' ? this.getInitialState() : this._state
    return assertState(initialState)
  }

  /*
  * Default `getReducers` method. Could be overwritten.
  */
  static getReducers() {
    return undefined
  }

  /*
  * Internal `_getReducers` method. 
  * This function will look for a `static getReducers` method and call it.
  * If it does not exists then will use the constructor's 2nd parameter as the reducers.
  */
  _getReducers() {
    const reducers = this.constructor.getReducers() || this._reducers || {}

    if (reducers === undefined) {
      warning(
        `Reducers are not defined. Define the method \`static getReducers()\` for ${this.constructor
          .name} or provide an object with reducers as the constructor 2nd parameter.`,
      )
      return {}
    }

    return assertReducersObject(reducers)
  }

  /*
  * Internal method that will be called when the store is created.
  * Should be called recursively from the root thru the children.
  */
  _mount() {
    this.componentWillMount()

    const state = this._getInitialState()
    const reducers = this._getReducers()

    if (isAReduxableSet(state)) {
      // TODO: assert valid reduxable set
      this._setupChildren(state)
      this.reduce = combineReducers(state)
    } else {
      this._setupReducers(reducers)
      this._setupGlobalReducers(this.constructor.globalReducers)
      this._state = state
      this.reduce = this._getReducer()
    }

    this.componentDidMount()
  }

  /*
  *  The `_store` will be the Redux store. Since this store is unique by application, then we
  *  can save _statically_ and use it across all the Reduxable instances.
  *
  *  We use this store internally on two Reduxable instance methods:
  *    - `dispatch` to precisely dispatch the actions
  *    - `state` getter to retrieve the portion of state corredpondent to the Reduxable instance
  *
  *  This method is called from `createStore` method. See its documentation for more details.
  */

  static _setStore(store) {
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

  _setScope(scope) {
    this._scope = scope

    if (this._children) {
      Object.keys(this._children).forEach(key => {
        const child = this._children[key]
        child._setScope && child._setScope(`${scope}.${key}`)
      })
    }
  }

  /*
  *  `state` getter
  *  ------------
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
  *  Then `thisReduxableInstance.state` will return `reduxStore.state.a.b`
  */

  get state() {
    if (!this.constructor._store) {
      return this._state
    }
    let rootState = this.constructor._store.getState()
    if (!this._scope) {
      return rootState
    }

    return this._scope.split('.').reduce((object, scopeKey) => object[scopeKey], rootState)
  }

  /*
  *  `state` setter
  *  ------------
  *  Will set the state if not already set
  */

  set state(newState) {
    warning(`You can not set the state directly. You need to call a reducer to mutate the state`)
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

  _getReducer() {
    return (state = this.state, { type, scope, payload }) => {
      const globalReducer = this._globalReducers[type]
      if (globalReducer) {
        const newState = globalReducer(state, payload)
        this.stateWillChange(newState)
        return newState
      }

      if (!this.constructor._global && scope !== this._scope) {
        return state
      }

      const scopedReducer = this._scopedReducers[type]

      if (scopedReducer) {
        const newState = scopedReducer(state, payload)
        this.stateWillChange(newState)
        return newState
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
    this._scopedReducers = reducers
    this.reducers = {}

    for (const reducerName in reducers) {
      if (reducers.hasOwnProperty(reducerName)) {
        // this[reducerName] = payload => this._callReducer(reducerName, payload)
        this.reducers[reducerName] = payload => this._callReducer(reducerName, payload)
      }
    }
  }

  /*
  *  This method will store the `globalReducers` that will listen that actions no matter the scope
  */

  _setupGlobalReducers(globalReducers = {}) {
    this._globalReducers = globalReducers
  }

  /*
  *  This method will setup the state as properties
  */
  _setupChildren(children) {
    this._children = children

    for (const childName in children) {
      if (children.hasOwnProperty(childName)) {
        assertChildName(this, childName)
        this[childName] = children[childName]
        this[childName]._mount && this[childName]._mount()
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
    if (this.constructor._store) {
      return this._dispatch({ type: reducerName, scope: this._scope, payload })
    }

    const newState = this._scopedReducers[reducerName](this.state, payload)
    this.stateWillChange(newState)
    this._state = newState
  }

  /*
  *  This method will dispatch the action calling the lifecycle hooks
  *  for `actionWillDispatch` and `actionDidDispatch`
  */

  _dispatch(action) {
    this.actionWillDispatch(action)
    this.constructor._store.dispatch(action)
    this.actionDidDispatch(action)
  }

  /*
  *  Default lifecycles
  */

  componentWillMount() {}
  componentDidMount() {}
  actionWillDispatch(action) {}
  actionDidDispatch(action) {}
  stateWillChange(state) {}
}

export default Reduxable
