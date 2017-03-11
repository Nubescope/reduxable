import camelCase from 'lodash/camelCase';
import upperCase from 'lodash/upperCase';

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
    let state = this.constructor._store.getState();
    if (!this._scope) {
      return state;
    }

    return this._scope.split('.').reduce((object, scopeKey) => object[scopeKey], state);
  }

  getReducer() {
    return (state = this.initialState, action) => {
      if (action.scope !== this._scope) {
        return state;
      }

      const type = camelCase(action.type);
      const method = this.reducers[type];

      if (method) {
        const newState = method(state, action);
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
          this._actions[reducerName] = action => ({ ...action, type: reducerName, scope: this._scope });
        }
      }
    }

    return this._actions;
  }

  get dispatchers() {
    if (!this._boundedActions) {
      this._boundedActions = {};
      const dispatch = this.constructor._store.dispatch;

      for (const reducerName in this.reducers) {
        if (this.reducers.hasOwnProperty(reducerName)) {
          this._boundedActions[reducerName] = action => dispatch({ ...action, type: reducerName, scope: this._scope });
        }
      }
    }

    return this._boundedActions;
  }
}
