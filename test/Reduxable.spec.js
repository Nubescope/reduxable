import Reduxable, { createStore, combineReducers } from '../src'

const MISSING_REDUCERS_ERROR_MSG =
  `You must provide the 'reducers' as:\n` +
  ` - the first parameter of Reduxable constructor\n` +
  ` - setting the static 'reducers' to your class`

const MISSING_STATE_ERROR_MSG =
  `You must provide the 'initial state' as:\n` +
  ` - the second parameter of Reduxable constructor\n` +
  ` - setting the static 'state' to your class`

class Without extends Reduxable {
  constructor() {
    const reducers = {}
    super({ increment: state => state + 1 })
  }
}

describe('Reduxable', () => {
  beforeEach(() => {
    Reduxable.setStore(undefined)
  })

  describe('constructor assertions', () => {
    describe('reducers (1st parameter)', () => {
      it('should throw error if no reducers provided'), () => {
        expect(() => new Reduxable()).toThrowError(MISSING_REDUCERS_ERROR_MSG)
      }

      it('should throw error if reducers is null', () => {
        expect(() => new Reduxable(null)).toThrowError(`The reducers must be an object and it is 'null'`)
      })

      it('should throw error if reducers is a number', () => {
        expect(() => new Reduxable(123)).toThrowError(`The reducers must be an object and it is '123'`)
      })

      it('should throw error if reducers is a string', () => {
        expect(() => new Reduxable('foo')).toThrowError(`The reducers must be an object and it is 'foo'`)
      })

      it('should throw error if reducers are an empty object', () => {
        expect(() => new Reduxable({})).toThrowError(`The reducers must not be empty`)
      })

      it('should throw error if reducers are an empty array', () => {
        expect(() => new Reduxable([])).toThrowError(`The reducers must not be empty`)
      })
    })

    describe('state (2nd parameter)', () => {
      it('should throw error if state is undefined', () => {
        const validReducers = { a: () => {} }
        expect(() => new Reduxable(validReducers)).toThrowError(MISSING_STATE_ERROR_MSG)
      })
    })
  })

  describe('reducers', () => {
    it('should be exposed as a property', () => {
      const reducers = { keep: state => state, reverse: state => !state }
      const reduxable = new Reduxable(reducers, null)
      expect(reduxable.reducers).toEqual(reducers)
    })
  })

  describe('getState', () => {
    it('should return the default state (no connected with Redux)', () => {
      const reducers = { addLetter: state => state + 'A' }
      const reduxable = new Reduxable(reducers, 'SOME_INITIAL_STATE')
      expect(reduxable.getState()).toEqual('SOME_INITIAL_STATE')
    })

    it('should return the default state (connected with Redux)', () => {
      const reducers = { addLetter: state => state + 'A' }
      const reduxable = new Reduxable(reducers, 'SOME_INITIAL_STATE')
      const store = createStore(reduxable)
      Reduxable.setStore(store)

      expect(reduxable.getState()).toEqual('SOME_INITIAL_STATE')
      expect(store.getState()).toEqual('SOME_INITIAL_STATE')
    })
  })

  describe('actionCreators', () => {
    it('should be exposed as methods', () => {
      const reducers = { keep: state => state, reverse: state => !state }
      const reduxable = new Reduxable(reducers, null)

      expect(typeof reduxable.keep).toEqual('function')
      expect(typeof reduxable.reverse).toEqual('function')
    })

    it('should modify the state even if not connected with Redux', () => {
      const counter = new Reduxable({ increment: state => state + 1 }, 0)
      counter.increment()
      expect(counter.getState()).toEqual(1)
    })

    it('should modify the state connected with Redux', () => {
      const counter = new Reduxable({ increment: state => state + 1 }, 10)
      const store = createStore(counter)
      Reduxable.setStore(store)

      counter.increment()
      expect(counter.getState()).toEqual(11)
    })
  })

  describe('combineReducers', () => {
    it('should work together with combineReducers', () => {
      const counter = new Reduxable({ increment: state => state + 1 }, 20)
      const store = createStore(combineReducers({ counter }))
      Reduxable.setStore(store)

      counter.increment()
      expect(counter.getState()).toEqual(21)
      expect(store.getState()).toEqual({ counter: 21 })
    })

    it('should work using two reduxables with same methods', () => {
      const counter1 = new Reduxable({ increment: state => state + 1 }, 0)
      const counter2 = new Reduxable({ increment: state => state + 1 }, 5)
      const store = createStore(combineReducers({ counter1, counter2 }))
      Reduxable.setStore(store)

      counter1.increment()
      expect(counter1.getState()).toEqual(1)
      expect(counter2.getState()).toEqual(5)
      expect(store.getState()).toEqual({ counter1: 1, counter2: 5 })

      counter2.increment()
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

        expect(() => new InvalidReduxable()).toThrowError(MISSING_REDUCERS_ERROR_MSG)
      })

      it('should throw error when calling super with no state', () => {
        class InvalidReduxable extends Reduxable {
          constructor() {
            super({ increment: state => state + 1 })
          }
        }

        expect(() => new InvalidReduxable()).toThrowError(MISSING_STATE_ERROR_MSG)
      })

      it('should work using providing reducers and state', () => {
        class ValidReduxable extends Reduxable {
          constructor() {
            super({ increment: state => state + 1 }, 0)
          }
        }

        new ValidReduxable()
      })

      it('should work using static reducers and state', () => {
        class ValidReduxable extends Reduxable {}

        ValidReduxable.reducers = { increment: state => state + 1 }
        ValidReduxable.state = 0

        const counter = new ValidReduxable()
        expect(counter.getState()).toEqual(0)
        counter.increment()
        expect(counter.getState()).toEqual(1)
      })

      it('should work using static state and providing reducers in constructor', () => {
        class ValidReduxable extends Reduxable {
          constructor() {
            super({ increment: state => state + 1 })
          }
        }

        ValidReduxable.state = 0

        const counter = new ValidReduxable()
        expect(counter.getState()).toEqual(0)
        counter.increment()
        expect(counter.getState()).toEqual(1)
      })
    })
  })
})
