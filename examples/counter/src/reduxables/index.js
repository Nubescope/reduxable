import Reduxable from 'reduxable'

class CounterReduxable extends Reduxable {
  constructor() {
    super(0)
  }

  static reducers = {
    increment: state => state + 1,
    decrement: state => state - 1,
  }
}

export default CounterReduxable
