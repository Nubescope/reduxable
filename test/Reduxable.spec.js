import Reduxable, { createStore, combineReducers } from '../src'

import { UNDEFINED_STATE_ERROR, UNDEFINED_REDUCERS_ERROR } from '../src/assertions'

class Counter extends Reduxable {
  getInitialState() {
    return 0
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
        expect(() => {
          const reduxable = new Reduxable()
          reduxable._mount()
        }).toThrowError(UNDEFINED_STATE_ERROR)
      })
    })

    describe('reducers (2nd parameter)', () => {
      xit('should throw error if no reducers provided', () => {
        expect(() => new Reduxable('MOCK_STATE')._mount()).toThrowError(UNDEFINED_REDUCERS_ERROR)
      })

      xit('should throw error if reducers is null', () => {
        expect(() => new Reduxable('MOCK_STATE', null)._mount()).toThrowError(
          `The reducers must be an object and it is 'null'`,
        )
      })

      it('should throw error if reducers is a number', () => {
        expect(() => new Reduxable('MOCK_STATE', 123)._mount()).toThrowError(
          `The reducers must be an object and it is '123'`,
        )
      })

      it('should throw error if reducers is a string', () => {
        expect(() => new Reduxable('MOCK_STATE', 'foo')._mount()).toThrowError(
          `The reducers must be an object and it is 'foo'`,
        )
      })

      xit('should throw error if reducers are an empty object', () => {
        expect(() => new Reduxable('MOCK_STATE', {})._mount()).toThrowError(`The reducers must not be empty`)
      })

      xit('should throw error if reducers are an empty array', () => {
        expect(() => new Reduxable('MOCK_STATE', [])._mount()).toThrowError(`The reducers must not be empty`)
      })
    })
  })

  describe('state getter', () => {
    it('should return the default state (no connected with Redux)', () => {
      const reducers = { addLetter: state => state + 'A' }
      const reduxable = new Reduxable('SOME_INITIAL_STATE', reducers)
      reduxable._mount()
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
      reduxable._mount()

      expect(typeof reduxable.reducers.keep).toEqual('function')
      expect(typeof reduxable.reducers.reverse).toEqual('function')
    })

    it('should modify the state even if not connected with Redux', () => {
      const counter = new Reduxable(0, { increment: state => state + 1 })
      counter._mount()
      counter.reducers.increment()
      expect(counter.state).toEqual(1)
    })

    it('should modify the state connected with Redux', () => {
      const counter = new Reduxable(10, { increment: state => state + 1 })
      const store = createStore(counter)
      Reduxable._setStore(store)

      counter.reducers.increment()
      expect(counter.state).toEqual(11)
    })
  })

  describe('globalReducers', () => {
    it('should listen to global actions no matter the scope', () => {
      class NewCounter extends Reduxable {
        getInitialState() {
          return 10
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

  describe('extending Reduxable class', () => {
    describe('constructor assertions', () => {
      it('should throw error when calling super with no parameters', () => {
        class InvalidReduxable extends Reduxable {
          getInitialState() {
            return undefined
          }
        }

        expect(() => new InvalidReduxable()._mount()).toThrowError(UNDEFINED_STATE_ERROR)
      })

      it('should work if `getInitialState` is defined', () => {
        class InvalidReduxable extends Reduxable {
          getInitialState() {
            return 0
          }
        }

        new InvalidReduxable()._mount()
      })

      it('should work using providing state and reducers', () => {
        class ValidReduxable extends Reduxable {
          getInitialState() {
            return 0
          }

          static getReducers() {
            return { increment: state => state + 1 }
          }
        }

        new ValidReduxable()._mount()
      })

      it('should work using static reducers and providing state via getInitialState', () => {
        class ValidReduxable extends Reduxable {
          getInitialState() {
            return 0
          }
        }

        ValidReduxable.reducers = { increment: state => state + 1 }

        const counter = new ValidReduxable()
        counter._mount()
        expect(counter.state).toEqual(0)
        counter.reducers.increment()
        expect(counter.state).toEqual(1)
      })
    })

    describe('methods assertions', () => {
      it('should throw error if method name and state child name collide', () => {
        class InvalidReduxable extends Reduxable {
          getInitialState() {
            return { counter: new Counter() }
          }

          counter() {}
        }

        expect(() => new InvalidReduxable()._mount()).toThrowError(
          `You are defining a state child and a method with the same name 'counter'.\n` +
            `You need to change the state child or the method name.`,
        )
      })
    })

    describe('using extended classes', () => {
      it('should work', () => {
        class ValidReduxable extends Reduxable {
          constructor() {
            super(0)
          }
        }

        ValidReduxable.reducers = {
          increment: state => state + 1,
        }

        const app = new Reduxable({
          nested: new ValidReduxable(),
        })

        const store = createStore(app)
        // Reduxable._setStore(store)

        expect(app.state).toEqual({ nested: 0 })
        expect(app.nested.state).toEqual(0)
        expect(store.getState()).toEqual({ nested: 0 })

        app.nested.reducers.increment()

        expect(app.state).toEqual({ nested: 1 })
        expect(app.nested.state).toEqual(1)
        expect(store.getState()).toEqual({ nested: 1 })
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
      // Reduxable._setStore(store)

      expect(reduxableSet.state).toEqual({ counterOne: 0, counterTwo: 0 })
      expect(reduxableSet.counterOne.state).toEqual(0)
      expect(reduxableSet.counterTwo.state).toEqual(0)
      expect(store.getState()).toEqual({ counterOne: 0, counterTwo: 0 })

      reduxableSet.counterOne.increment()
      expect(reduxableSet.state).toEqual({ counterOne: 1, counterTwo: 0 })
      expect(reduxableSet.counterOne.state).toEqual(1)
      expect(reduxableSet.counterTwo.state).toEqual(0)
      expect(store.getState()).toEqual({ counterOne: 1, counterTwo: 0 })

      reduxableSet.counterTwo.increment()
      expect(reduxableSet.state).toEqual({ counterOne: 1, counterTwo: 1 })
      expect(reduxableSet.counterOne.state).toEqual(1)
      expect(reduxableSet.counterTwo.state).toEqual(1)
    })

    it('should compose a reduxable and a traditional reduce function', () => {
      const reduxableSet = new Reduxable({
        counterOne: new Counter(),
        counterTwo: counterReducerFunction,
      })

      const store = createStore(reduxableSet)
      Reduxable._setStore(store)

      expect(reduxableSet.state).toEqual({ counterOne: 0, counterTwo: 0 })

      reduxableSet.counterOne.increment()
      expect(reduxableSet.state).toEqual({ counterOne: 1, counterTwo: 0 })

      store.dispatch({ type: 'INCREMENT' })
      expect(reduxableSet.state).toEqual({ counterOne: 1, counterTwo: 1 })
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

      expect(reduxableSet.state).toEqual({ oneChild: { anotherChild: { counterOne: 0, counterTwo: 0 } } })

      reduxableSet.oneChild.anotherChild.counterOne.increment()
      expect(reduxableSet.state).toEqual({ oneChild: { anotherChild: { counterOne: 1, counterTwo: 0 } } })

      reduxableSet.oneChild.anotherChild.counterTwo.increment()
      expect(reduxableSet.state).toEqual({ oneChild: { anotherChild: { counterOne: 1, counterTwo: 1 } } })
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

      expect(reduxableSet.state).toEqual({ childOne: { counter: 0 }, childTwo: { counter: 0 } })

      reduxableSet.childOne.counter.increment()
      expect(reduxableSet.state).toEqual({ childOne: { counter: 1 }, childTwo: { counter: 0 } })

      reduxableSet.childTwo.counter.increment()
      expect(reduxableSet.state).toEqual({ childOne: { counter: 1 }, childTwo: { counter: 1 } })
    })

    it('should work with complex state objects', () => {
      class ValidReduxable extends Reduxable {
        constructor() {
          super({
            nullValue: null,
            undefinedValue: undefined,
            falseValue: false,
            zeroValue: 0,
            emptyStringValue: '',
            objectValue: {},
            arrayValue: [],
          })
        }
      }

      ValidReduxable.reducers = { increment: state => state + 1 }

      const reduxable = new ValidReduxable()

      const store = createStore(new Reduxable({ reduxable }))
      Reduxable._setStore(store)

      expect(reduxable.state).toEqual({
        nullValue: null,
        undefinedValue: undefined,
        falseValue: false,
        zeroValue: 0,
        emptyStringValue: '',
        objectValue: {},
        arrayValue: [],
      })
    })
  })
})
