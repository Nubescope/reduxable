import Reduxable from 'reduxable';

export default class CounterReduxable extends Reduxable {
  initialState = 0;

  static reducers = {
    increment: state => state + 1,
    decrement: state => state - 1,
  };
}
