export default class Reduxable {
  static setStore(store) {
    this._store = store;
  }

  setScope(scope) {
    this._scope = scope;
  }

  dispatch() {
    this.constructor._store.dispatch(arguments);
  }

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

  get dispatchers() {
    if (!this._boundedActions) {
      this._boundedActions = {};
      const dispatch = this.constructor._store ? this.constructor._store.dispatch : null;

      for (const reducerName in this.reducers) {
        if (this.reducers.hasOwnProperty(reducerName)) {
          this._boundedActions[reducerName] = dispatch
            ? payload => dispatch({ payload, type: reducerName, scope: this._scope })
            : payload => this._localState = this.reducers[reducerName](this.getState(), payload);
        }
      }
    }

    return this._boundedActions;
  }
}
