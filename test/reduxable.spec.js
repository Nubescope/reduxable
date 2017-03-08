import Reduxable, { createStore } from '../src';

class Counter extends Reduxable {
  constructor() {
    super();
    this.state = 0;
  }

  increment() {
    this.dispatchers.increment();
  }
  decrement() {
    this.dispatchers.decrement();
  }

  get reducers() {
    return {
      increment: state => state + 1,
      decrement: state => state - 1,
    };
  }
}

const counter = new Counter();

describe('Reduxable', () => {
  describe('createStore', () => {
    it('should work with a single Reduxable', () => {
      const store = createStore(counter);
      counter.increment();

      expect(counter.getState()).toEqual(1);
      expect(store.getState()).toEqual(1);

      counter.decrement();

      expect(counter.getState()).toEqual(0);
      expect(store.getState()).toEqual(0);
    });
  });

  describe('dispatchers', () => {});
});
