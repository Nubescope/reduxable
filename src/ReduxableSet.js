import combineReducers from './combineReducers'
import { assertReduxableSetChildren } from './assertions'

class ReduxableSet {
  /*
  */

  constructor(children = this.constructor.children) {
    assertReduxableSetChildren(children)

    this._setupChildren(children)
    this.reduce = combineReducers(children)
  }

  /*
  *  The `_store` will be the Redux store. Since this store is unique by application, then we
  *  can save _statically_ and use it across all the ReduxableSet instances.
  *
  *  We use this store internally on two ReduxableSet instance methods:
  *    - `dispatch` to precisely dispatch the actions
  *    - `getState` to retrieve the portion of state corredpondent to the ReduxableSet instance
  *
  *  This method is called from `createStore` method. See its documentation for more details.
  */

  static setStore(store) {
    this._store = store
  }

  /*
  *  The `_scope` will define where this ReduxableSet instance is placed on the global state tree
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
  *      b: thisReduxableSetInstance
  *    })
  *  })
  *
  *  Then `thisReduxableSetInstance.getState()` will return `reduxStore.getState().a.b`
  */
  getState() {
    if (!this.constructor._store) {
      const state = {}

      for (const childName in this.children) {
        state[childName] = this.children[childName].getState()
      }

      return state
    }

    let state = this.constructor._store.getState()
    if (!this._scope) {
      return state
    }

    return this._scope.split('.').reduce((object, scopeKey) => object[scopeKey], state)
  }

  /*
  *  Returns a reducer combining all the children using `combineReducers`
  */

  _setupChildren(children) {
    this.children = children

    for (const childName in children) {
      if (children.hasOwnProperty(childName)) {
        //assertChildName(this, childName)
        this[childName] = children[childName]
      }
    }
  }
}

export default ReduxableSet
