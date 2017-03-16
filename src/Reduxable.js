export default class Reduxable {
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
    this._store = store;
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
    this._scope = scope;
  }

  /*
  *  In the constructor we set a new method for each reducer.
  *
  *  When called, each method will dispatch an action with the convenient `type` and `scope`
  *  so the reducer will catch this action.
  *
  *  ```
  *  class ReduxableExample extends Reduxable {
  *    reducers = {
  *      foo: () => {}
  *    }
  *  }
  *
  *  const reduxableInstance = new ReduxableExample()
  *  reduxableInstance.foo('hello world')
  *  // Will dispatch an action like => { type: 'foo', payload: 'hello world', scope: '...' }
  *  ```
  */

  constructor() {
    this.state = {};
    for (const reducerName in this.actions) {
      const actionForReducer = this.actions[reducerName];
      this.state[reducerName] = payload => this.dispatch(actionForReducer(payload));
    }
  }

  /*
  *  If store has been already set, then call the store's `dispatch`
  *  If not, apply the reducer to the current state and set it in `_localState`
  */
  dispatch(action) {
    const store = this.constructor._store;
    if (store) {
      return store.dispatch(action);
    }

    const { type, payload } = action;
    this._localState = this.constructor.reducers[type](this.getState(), payload);
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
      return this._localState || this.initialState;
    }

    let state = this.constructor._store.getState();
    if (!this._scope) {
      return state;
    }

    return this._scope.split('.').reduce((object, scopeKey) => object[scopeKey], state);
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
    return (state = this.initialState, { type, scope, payload }) => {
      if (scope !== this._scope) {
        return state;
      }

      const method = this.constructor.reducers[type];

      if (method) {
        const newState = method(state, payload);
        if (typeof state === 'object' && state === newState) {
          throw new Error('Reducer should never return the same `state` object');
        }
        return newState;
      }

      return state;
    };
  }

  /*
  *  Returns an object with all the action creators for the defined reducers
  *
  *  This method will iterate over all the defined `reducers` and create a new
  *  object of methods (action creators)
  *
  *  ```
  *  class ReduxableExample extends Reduxable {
  *    reducers = {
  *      foo: () => {}
  *    }
  *  }
  *
  *  const reduxableInstance = new ReduxableExample()
  *  const action = reduxableInstance.actions.foo('hello world')
  *  console.log(action)
  *  // { type: 'foo', payload: 'hello world', scope: '...' }
  *  ```
  */
  get actions() {
    if (!this._actions) {
      this._actions = {};

      for (const reducerName in this.constructor.reducers) {
        if (this.constructor.reducers.hasOwnProperty(reducerName)) {
          this._actions[reducerName] = payload => ({ payload, type: reducerName, scope: this._scope });
        }
      }
    }

    return this._actions;
  }
}
