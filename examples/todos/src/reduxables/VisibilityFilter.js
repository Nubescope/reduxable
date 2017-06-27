import Reduxable from 'reduxable'

class VisibilityFilter extends Reduxable {
  constructor() {
    super('SHOW_ALL')
  }

  static reducers = {
    setVisibilityFilter: (state, filter) => filter,
  }

  setVisibilityFilter = filter => this.reducers.setVisibilityFilter(filter)
}

export default VisibilityFilter
