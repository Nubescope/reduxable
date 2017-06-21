import Reduxable, { createStore, combineReducers } from '../src'

const MISSING_REDUCERS_ERROR_MSG =
  `You must provide the 'reducers' as:\n` +
  ` - the second parameter of Reduxable constructor\n` +
  ` - setting the static 'reducers' to your class`

const MISSING_STATE_ERROR_MSG =
  `You must provide the 'initial state' as:\n` +
  ` - the first parameter of Reduxable constructor\n` +
  ` - setting the static 'state' to your class`

class Counter extends Reduxable {
  constructor() {
    super(0)
  }

  increment() {
    this.reducers.increment()
  }

  decrement() {
    this.reducers.decrement()
  }
}
Counter.reducers = { increment: state => state + 1, decrement: state => state - 1 }
Counter.globalReducers = { reset: () => 0 }

const counterReducerFunction = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

describe('Reduxable', () => {
  beforeEach(() => {
    Reduxable._setStore(undefined)
  })

  describe('constructor assertions', () => {
    describe('state (1st parameter)', () => {
      it('should throw error if state is undefined', () => {
        expect(() => new Reduxable()).toThrowError(MISSING_STATE_ERROR_MSG)
      })
    })

    describe('reducers (2nd parameter)', () => {
      it('should throw error if no reducers provided'), () => {
        expect(() => new Reduxable('MOCK_STATE')).toThrowError(MISSING_REDUCERS_ERROR_MSG)
      }

      it('should throw error if reducers is null', () => {
        expect(() => new Reduxable('MOCK_STATE', null)).toThrowError(`The reducers must be an object and it is 'null'`)
      })

      it('should throw error if reducers is a number', () => {
        expect(() => new Reduxable('MOCK_STATE', 123)).toThrowError(`The reducers must be an object and it is '123'`)
      })

      it('should throw error if reducers is a string', () => {
        expect(() => new Reduxable('MOCK_STATE', 'foo')).toThrowError(`The reducers must be an object and it is 'foo'`)
      })

      it('should throw error if reducers are an empty object', () => {
        expect(() => new Reduxable('MOCK_STATE', {})).toThrowError(`The reducers must not be empty`)
      })

      it('should throw error if reducers are an empty array', () => {
        expect(() => new Reduxable('MOCK_STATE', [])).toThrowError(`The reducers must not be empty`)
      })
    })
  })

  // describe('reducers', () => {
  //   it('should be exposed as a property', () => {
  //     const reducers = { keep: state => state, reverse: state => !state }
  //     const reduxable = new Reduxable(null, reducers)
  //     expect(reduxable.reducers).toEqual(reducers)
  //   })
  // })

  describe('getState', () => {
    it('should return the default state (no connected with Redux)', () => {
      const reducers = { addLetter: state => state + 'A' }
      const reduxable = new Reduxable('SOME_INITIAL_STATE', reducers)
      expect(reduxable.getState()).toEqual('SOME_INITIAL_STATE')
    })

    it('should return the default state (connected with Redux)', () => {
      const reducers = { addLetter: state => state + 'A' }
      const reduxable = new Reduxable('SOME_INITIAL_STATE', reducers)
      const store = createStore(reduxable)
      Reduxable._setStore(store)

      expect(reduxable.getState()).toEqual('SOME_INITIAL_STATE')
      expect(store.getState()).toEqual('SOME_INITIAL_STATE')
    })
  })

  describe('state getter', () => {
    it('should return the default state (no connected with Redux)', () => {
      const reducers = { addLetter: state => state + 'A' }
      const reduxable = new Reduxable('SOME_INITIAL_STATE', reducers)
      expect(reduxable.state).toEqual('SOME_INITIAL_STATE')
    })

    it('should return the default state (connected with Redux)', () => {
      const reducers = { addLetter: state => state + 'A' }
      const reduxable = new Reduxable('SOME_INITIAL_STATE', reducers)
      const store = createStore(reduxable)
      Reduxable._setStore(store)

      expect(reduxable.state).toEqual('SOME_INITIAL_STATE')
      expect(store.getState()).toEqual('SOME_INITIAL_STATE')
    })
  })

  describe('actionCreators', () => {
    it('should be exposed as methods in the `reducers` property', () => {
      const reducers = { keep: state => state, reverse: state => !state }
      const reduxable = new Reduxable(null, reducers)

      expect(typeof reduxable.reducers.keep).toEqual('function')
      expect(typeof reduxable.reducers.reverse).toEqual('function')
    })

    it('should modify the state even if not connected with Redux', () => {
      const counter = new Reduxable(0, { increment: state => state + 1 })
      counter.reducers.increment()
      expect(counter.getState()).toEqual(1)
    })

    it('should modify the state connected with Redux', () => {
      const counter = new Reduxable(10, { increment: state => state + 1 })
      const store = createStore(counter)
      Reduxable._setStore(store)

      counter.reducers.increment()
      expect(counter.getState()).toEqual(11)
    })
  })

  describe('globalReducers', () => {
    it('should listen to global actions no matter the scope', () => {
      class NewCounter extends Reduxable {
        constructor() {
          super(10)
        }
      }

      NewCounter.reducers = { increment: state => state + 1 }
      NewCounter.globalReducers = { reset: () => 0 }

      const counter = new NewCounter()

      const store = createStore(counter)
      Reduxable._setStore(store)

      expect(counter.state).toEqual(10)
      counter.reducers.increment()
      expect(counter.state).toEqual(11)
      store.dispatch({ type: 'reset' })
      expect(counter.state).toEqual(0)
    })
  })

  describe('combineReducers', () => {
    it('should work together with combineReducers', () => {
      const counter = new Reduxable(20, { increment: state => state + 1 })
      const store = createStore(combineReducers({ counter }))
      Reduxable._setStore(store)

      counter.reducers.increment()
      expect(counter.getState()).toEqual(21)
      expect(store.getState()).toEqual({ counter: 21 })
    })

    it('should work using two reduxables with same methods', () => {
      const counter1 = new Reduxable(0, { increment: state => state + 1 })
      const counter2 = new Reduxable(5, { increment: state => state + 1 })
      const store = createStore(combineReducers({ counter1, counter2 }))
      Reduxable._setStore(store)

      counter1.reducers.increment()
      expect(counter1.getState()).toEqual(1)
      expect(counter2.getState()).toEqual(5)
      expect(store.getState()).toEqual({ counter1: 1, counter2: 5 })

      counter2.reducers.increment()
      expect(counter1.getState()).toEqual(1)
      expect(counter2.getState()).toEqual(6)
      expect(store.getState()).toEqual({ counter1: 1, counter2: 6 })
    })
  })

  describe('extending Reduxable class', () => {
    describe('constructor assertions', () => {
      it('should throw error when calling super with no parameters', () => {
        class InvalidReduxable extends Reduxable {
          constructor() {
            super()
          }
        }

        expect(() => new InvalidReduxable()).toThrowError(MISSING_STATE_ERROR_MSG)
      })

      it('should throw error when calling super with no reducers', () => {
        class InvalidReduxable extends Reduxable {
          constructor() {
            super(0)
          }
        }

        expect(() => new InvalidReduxable()).toThrowError(MISSING_REDUCERS_ERROR_MSG)
      })

      it('should work using providing state and reducers', () => {
        class ValidReduxable extends Reduxable {
          constructor() {
            super(0, { increment: state => state + 1 })
          }
        }

        new ValidReduxable()
      })

      it('should work using static reducers and state', () => {
        class ValidReduxable extends Reduxable {}

        ValidReduxable.state = 0
        ValidReduxable.reducers = { increment: state => state + 1 }

        const counter = new ValidReduxable()
        expect(counter.getState()).toEqual(0)
        counter.reducers.increment()
        expect(counter.getState()).toEqual(1)
      })

      it('should work using static reducers and providing state in constructor', () => {
        class ValidReduxable extends Reduxable {
          constructor() {
            super(0)
          }
        }

        ValidReduxable.reducers = { increment: state => state + 1 }

        const counter = new ValidReduxable()
        expect(counter.getState()).toEqual(0)
        counter.reducers.increment()
        expect(counter.state).toEqual(1)
      })
    })

    describe('methods assertions', () => {
      it('should throw error if method name and state child name collide', () => {
        class InvalidReduxable extends Reduxable {
          constructor() {
            super({ counter: new Counter() })
          }

          counter() {}
        }

        expect(() => new InvalidReduxable()).toThrowError(
          `You are defining a state child and a method with the same name 'counter'.\n` +
            `You need to change the state child or the method name.`,
        )
      })
    })
  })

  describe('as a combination of reduxables/reducers', () => {
    it('should compose two reduxables', () => {
      const reduxableSet = new Reduxable({
        counterOne: new Counter(),
        counterTwo: new Counter(),
      })

      const store = createStore(reduxableSet)
      Reduxable._setStore(store)

      expect(reduxableSet.getState()).toEqual({ counterOne: 0, counterTwo: 0 })
      expect(reduxableSet.counterOne.getState()).toEqual(0)
      expect(reduxableSet.counterTwo.getState()).toEqual(0)

      reduxableSet.counterOne.increment()
      expect(reduxableSet.getState()).toEqual({ counterOne: 1, counterTwo: 0 })
      expect(reduxableSet.counterOne.getState()).toEqual(1)
      expect(reduxableSet.counterTwo.getState()).toEqual(0)

      reduxableSet.counterTwo.increment()
      expect(reduxableSet.getState()).toEqual({ counterOne: 1, counterTwo: 1 })
      expect(reduxableSet.counterOne.getState()).toEqual(1)
      expect(reduxableSet.counterTwo.getState()).toEqual(1)
    })

    it('should compose a reduxable and a traditional reduce function', () => {
      const reduxableSet = new Reduxable({
        counterOne: new Counter(),
        counterTwo: counterReducerFunction,
      })

      const store = createStore(reduxableSet)
      Reduxable._setStore(store)

      expect(reduxableSet.getState()).toEqual({ counterOne: 0, counterTwo: 0 })

      reduxableSet.counterOne.increment()
      expect(reduxableSet.getState()).toEqual({ counterOne: 1, counterTwo: 0 })

      store.dispatch({ type: 'INCREMENT' })
      expect(reduxableSet.getState()).toEqual({ counterOne: 1, counterTwo: 1 })
    })

    it('should support nested Reduxable', () => {
      const reduxableSet = new Reduxable({
        oneChild: new Reduxable({
          anotherChild: new Reduxable({
            counterOne: new Counter(),
            counterTwo: new Counter(),
          }),
        }),
      })

      const store = createStore(reduxableSet)
      Reduxable._setStore(store)

      expect(reduxableSet.getState()).toEqual({ oneChild: { anotherChild: { counterOne: 0, counterTwo: 0 } } })

      reduxableSet.oneChild.anotherChild.counterOne.increment()
      expect(reduxableSet.getState()).toEqual({ oneChild: { anotherChild: { counterOne: 1, counterTwo: 0 } } })

      reduxableSet.oneChild.anotherChild.counterTwo.increment()
      expect(reduxableSet.getState()).toEqual({ oneChild: { anotherChild: { counterOne: 1, counterTwo: 1 } } })
    })

    it('should support similar Reduxables nested at first level', () => {
      const reduxableSet = new Reduxable({
        childOne: new Reduxable({
          counter: new Counter(),
        }),
        childTwo: new Reduxable({
          counter: new Counter(),
        }),
      })

      const store = createStore(reduxableSet)
      Reduxable._setStore(store)

      expect(reduxableSet.childOne._scope).toEqual('childOne')
      expect(reduxableSet.childTwo._scope).toEqual('childTwo')
      expect(reduxableSet.childOne.counter._scope).toEqual('childOne.counter')

      expect(reduxableSet.getState()).toEqual({ childOne: { counter: 0 }, childTwo: { counter: 0 } })

      reduxableSet.childOne.counter.increment()
      expect(reduxableSet.getState()).toEqual({ childOne: { counter: 1 }, childTwo: { counter: 0 } })

      reduxableSet.childTwo.counter.increment()
      expect(reduxableSet.getState()).toEqual({ childOne: { counter: 1 }, childTwo: { counter: 1 } })
    })
  })
})
