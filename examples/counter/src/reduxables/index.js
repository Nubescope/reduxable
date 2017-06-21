import Reduxable from 'reduxable'

class CounterReduxable extends Reduxable {
  static state = 0

  static reducers = {
    increment: state => state + 1,
    decrement: state => state - 1,
  }
}

// CounterReduxable.state = 0
// CounterReduxable.reducers = {
//   increment: state => state + 1,
//   decrement: state => state - 1,
// }

export default CounterReduxable
