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
      add: (state, number) => state + number,
    };
  }
}

describe('Reduxable', () => {
  beforeEach(() => {
    Reduxable.setStore(undefined);
  });

  it('should work without initialState', () => {
    const x = new WithoutInitialState();
    x.dispatchers.doNothing();
  });

  it('should work even if not connected to Redux', () => {
    const x = new WithoutReducers();
    expect(x.actions).toEqual({});
    expect(x.dispatchers).toEqual({});
  });

  it('could get state even if not connected to Redux', () => {
    const counter = new Counter();
    // const store = createStore(counter);
    expect(counter.getState()).toEqual(0);
    counter.increment();
    expect(counter.getState()).toEqual(1);
    counter.decrement();
    expect(counter.getState()).toEqual(0);
  });

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
      x.dispatchers.returnUndefined();
      x.dispatchers.returnUndefined();
    });

    it('should NOT throw an error if same state is a number', () => {
      const x = new WrongReducers();
      x.dispatchers.returnANumber();
      x.dispatchers.returnANumber();
    });

    it('should NOT throw an error if same state is a string', () => {
      const x = new WrongReducers();
      x.dispatchers.returnAString();
      x.dispatchers.returnAString();
    });
  });

  describe('dispatchers', () => {
    it('should be able to receive any type of parameter (not just objects)', () => {
      const counter = new Counter();
      counter.dispatchers.add(5);
      expect(counter.getState()).toEqual(5);
    });

    it('should be able to receive any type of parameter connected with Redux', () => {
      const counter = new Counter();
      const store = createStore(counter);
      counter.dispatchers.add(5);
      expect(counter.getState()).toEqual(5);
      expect(store.getState()).toEqual(5);
    });
  });

  describe('actions', () => {
    it('returns an action as plain object when calling an existent method', () => {
      const counter = new Counter();
      const incrementAction = counter.actions.increment();
      expect(incrementAction).toEqual({ type: 'increment' });
    });

    it('throws an exception if method not exists', done => {
      const counter = new Counter();
      try {
        counter.actions.notExistentMethod();
      } catch (e) {
        expect(e.message).toEqual('counter.actions.notExistentMethod is not a function');
        done();
      }
    });
  });
});
