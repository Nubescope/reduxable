export default class Reduxable {
  static setStore(store) {
    this._store = store;
  }

  setScope(scope) {
    this._scope = scope;
  }

  /*
  *  If store exists, then call the store's `dispatch`
  *  If not, apply the reducer to the local state
  */
  dispatch(action) {
    const store = this.constructor._store;
    if (store) {
      return store.dispatch(action);
    }

    const { type, payload } = action;
    this._localState = this.reducers[type](this.getState(), payload);
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

      const method = this.reducers[type];

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

      for (const reducerName in this.reducers) {
        if (this.reducers.hasOwnProperty(reducerName)) {
          this._actions[reducerName] = payload => ({ payload, type: reducerName, scope: this._scope });
        }
      }
    }

    return this._actions;
  }

  /*
  *  Returns an object with methods that dispatch an action based on each reducer
  *
  *  ```
  *  class ReduxableExample extends Reduxable {
  *    reducers = {
  *      foo: () => {}
  *    }
  *  }
  *
  *  const reduxableInstance = new ReduxableExample()
  *  reduxableInstance.dispatchers.foo('hello world')
  *  // Will dispatch an action like => { type: 'foo', payload: 'hello world', scope: '...' }
  *  ```
  */
  get dispatchers() {
    if (!this._dispatchers) {
      this._dispatchers = {};

      for (const reducerName in this.actions) {
        const actionForReducer = this.actions[reducerName];
        this._dispatchers[reducerName] = payload => this.dispatch(actionForReducer(payload));
      }
    }

    return this._dispatchers;
  }
}
