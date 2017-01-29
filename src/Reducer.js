import upperCase from 'lodash/upperCase'

export default class Reducer {

  get actions() {
    if (!this._actions) {
      this._actions = {}

      for(const reducer in this) {
        if (typeof this[reducer] === 'function') {
          const type = upperCase(reducer).replace(' ', '_')
          this._actions[reducer] = (action) => ({ ...action, type })
        }
      }
    }

    return this._actions
  }

}
