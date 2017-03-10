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
        return method(state, action);
      }

      return state;
    };
  }

  get actions() {
    if (!this._actions) {
      this._actions = {};

      for (const reducer in this.reducers) {
        if (this.reducers.hasOwnProperty(reducer)) {
          const type = upperCase(reducer).replace(' ', '_');
          const scope = this._scope;
          this._actions[reducer] = action => ({ ...action, type, scope });
        }
      }
    }

    return this._actions;
  }

  get dispatchers() {
    if (!this._boundedActions) {
      this._boundedActions = {};

      for (const reducer in this.reducers) {
        if (this.reducers.hasOwnProperty(reducer)) {
          const type = upperCase(reducer).replace(' ', '_');
          const dispatch = this.constructor._store.dispatch;
          const scope = this._scope;
          this._boundedActions[reducer] = action => dispatch({ ...action, type, scope });
        }
      }
    }

    return this._boundedActions;
  }
}
