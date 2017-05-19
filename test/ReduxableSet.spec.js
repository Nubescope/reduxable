import Reduxable, { createStore, combineReducers } from '../src'
import ReduxableSet from '../src/ReduxableSet'

class Counter extends Reduxable {
  constructor() {
    super({ increment: state => state + 1, decrement: state => state - 1 }, 0)
  }
}

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
    Reduxable.setStore(undefined)
    ReduxableSet.setStore(undefined)
  })

  describe('constructor', () => {
    describe('assertions', () => {
      it('should throw error if no children provided'), () => {
        expect(() => new ReduxableSet()).toThrowError(
          `You must provide the children as the first parameter of ReduxableSet constructor`
        )
      }

      it('should throw error if children is null', () => {
        expect(() => new ReduxableSet(null)).toThrowError(`The children must be an object and it is 'null'`)
      })

      it('should throw error if children is a number', () => {
        expect(() => new ReduxableSet(123)).toThrowError(`The children must be an object and it is '123'`)
      })

      it('should throw error if children is a string', () => {
        expect(() => new ReduxableSet('foo')).toThrowError(`The children must be an object and it is 'foo'`)
      })

      it('should throw error if children are an empty object', () => {
        expect(() => new ReduxableSet({})).toThrowError(`The children must not be empty`)
      })

      it('should throw error if children are an empty array', () => {
        expect(() => new ReduxableSet([])).toThrowError(`The children must not be empty`)
      })
    })

    it('should compose two reduxables', () => {
      const reduxableSet = new ReduxableSet({
        counterOne: new Counter(),
        counterTwo: new Counter(),
      })

      const store = createStore(reduxableSet)
      Reduxable.setStore(store)
      ReduxableSet.setStore(store)

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
      const reduxableSet = new ReduxableSet({
        counterOne: new Counter(),
        counterTwo: counterReducerFunction,
      })

      const store = createStore(reduxableSet)
      Reduxable.setStore(store)
      ReduxableSet.setStore(store)

      expect(reduxableSet.getState()).toEqual({ counterOne: 0, counterTwo: 0 })

      reduxableSet.counterOne.increment()
      expect(reduxableSet.getState()).toEqual({ counterOne: 1, counterTwo: 0 })

      store.dispatch({ type: 'INCREMENT' })
      expect(reduxableSet.getState()).toEqual({ counterOne: 1, counterTwo: 1 })
    })

    it('should support nested ReduxableSet', () => {
      const reduxableSet = new ReduxableSet({
        oneChild: new ReduxableSet({
          anotherChild: new ReduxableSet({
            counterOne: new Counter(),
            counterTwo: new Counter(),
          }),
        }),
      })

      const store = createStore(reduxableSet)
      Reduxable.setStore(store)
      ReduxableSet.setStore(store)

      expect(reduxableSet.getState()).toEqual({ oneChild: { anotherChild: { counterOne: 0, counterTwo: 0 } } })

      reduxableSet.oneChild.anotherChild.counterOne.increment()
      expect(reduxableSet.getState()).toEqual({ oneChild: { anotherChild: { counterOne: 1, counterTwo: 0 } } })

      reduxableSet.oneChild.anotherChild.counterTwo.increment()
      expect(reduxableSet.getState()).toEqual({ oneChild: { anotherChild: { counterOne: 1, counterTwo: 1 } } })
    })

    it('should support similar Reduxables nested at first level', () => {
      const reduxableSet = new ReduxableSet({
        childOne: new ReduxableSet({
          counter: new Counter(),
        }),
        childTwo: new ReduxableSet({
          counter: new Counter(),
        }),
      })

      const store = createStore(reduxableSet)
      Reduxable.setStore(store)
      ReduxableSet.setStore(store)

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

  describe('extending the ReduxableSet class', () => {
    it('should compose two reduxables', () => {
      class MyReduxableSet extends ReduxableSet {
        constructor() {
          super({
            counterOne: new Counter(),
            counterTwo: new Counter(),
          })
        }
      }

      const reduxableSet = new MyReduxableSet()

      const store = createStore(reduxableSet)
      Reduxable.setStore(store)
      ReduxableSet.setStore(store)

      expect(reduxableSet.getState()).toEqual({ counterOne: 0, counterTwo: 0 })
      reduxableSet.counterOne.increment()
      reduxableSet.counterOne.increment()
      expect(reduxableSet.getState()).toEqual({ counterOne: 2, counterTwo: 0 })
    })

    it('should work with custom methods', () => {
      class MyReduxableSet extends ReduxableSet {
        constructor() {
          super({
            counterOne: new Counter(),
            counterTwo: new Counter(),
          })
        }

        incrementBoth() {
          this.counterOne.increment()
          this.counterTwo.increment()
        }
      }

      const reduxableSet = new MyReduxableSet()

      const store = createStore(reduxableSet)
      Reduxable.setStore(store)
      ReduxableSet.setStore(store)

      expect(reduxableSet.getState()).toEqual({ counterOne: 0, counterTwo: 0 })
      reduxableSet.incrementBoth()
      expect(reduxableSet.getState()).toEqual({ counterOne: 1, counterTwo: 1 })
    })
  })

  describe('no-connected with Redux', () => {
    it('should work even disconnected from Redux', () => {
      const reduxableSet = new ReduxableSet({
        counterOne: new Counter(),
        counterTwo: new Counter(),
      })

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
  })
})
