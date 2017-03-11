import Reduxable, { createStore } from '../src';

class WithoutReducers extends Reduxable {}

class WrongReducers extends Reduxable {
  get initialState() {
    return {};
  }

  get reducers() {
    return {
      returnUndefined: () => undefined,
      returnSameState: state => state,
      returnANumber: () => 100,
      returnAString: () => 'Spinetta',
    };
  }
}

class WithoutInitialState extends Reduxable {
  get reducers() {
    return {
      doNothing() {},
    };
  }
}

class Counter extends Reduxable {
  constructor() {
    super();
    this.initialState = 0;
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

describe('Reduxable', () => {
  // it('should work even if not connected to Redux', () => {
  //   const x = new WithoutReducers();
  //   expect(x.actions).toEqual({});
  //   expect(x.dispatchers).toEqual({});
  // });

  // it('should work without initialState', () => {
  //   const x = new WithoutInitialState();
  //   x.dispatchers.doNothing();
  // });

  describe('createStore', () => {
    it('should work with a single Reduxable', () => {
      const counter = new Counter();
      const store = createStore(counter);
      counter.increment();

      expect(counter.getState()).toEqual(1);
      expect(store.getState()).toEqual(1);

      counter.decrement();

      expect(counter.getState()).toEqual(0);
      expect(store.getState()).toEqual(0);
    });
  });

  describe('reducers', () => {
    it('should throw an error if same state object is returned', done => {
      const x = new WrongReducers();
      const store = createStore(x);
      try {
        x.dispatchers.returnSameState();
      } catch (e) {
        done();
      }
    });

    it('should NOT throw an error if same state is undefined', () => {
      const x = new WrongReducers();
      const store = createStore(x);

      x.dispatchers.returnUndefined();
      x.dispatchers.returnUndefined();
    });

    it('should NOT throw an error if same state is a number', () => {
      const x = new WrongReducers();
      const store = createStore(x);

      x.dispatchers.returnANumber();
      x.dispatchers.returnANumber();
    });

    it('should NOT throw an error if same state is a string', () => {
      const x = new WrongReducers();
      const store = createStore(x);

      x.dispatchers.returnAString();
      x.dispatchers.returnAString();
    });
  });

  describe('dispatchers', () => {});
});
