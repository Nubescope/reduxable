import Reduxable from 'reduxable'

class VisibilityFilter extends Reduxable {
  constructor() {
    super({ setVisibilityFilter: (state, filter) => filter }, 'SHOW_ALL')
  }
}

export default VisibilityFilter
