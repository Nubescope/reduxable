import Reduxable, { Reducer } from 'reduxable';

export default class CounterReduxable extends Reduxable {
  state = 0;

  reducers = {
    increment: state => state + 1,
    decrement: state => state - 1,
  };
}
