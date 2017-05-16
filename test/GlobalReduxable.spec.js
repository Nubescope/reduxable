import Reduxable, { createStore, combineReducers } from '../src'
import GlobalReduxable from '../src/GlobalReduxable'

describe('GlobalReduxable', () => {
  beforeEach(() => {
    Reduxable.setStore(undefined)
    GlobalReduxable.setStore(undefined)
  })

  afterAll(() => {
    Reduxable.setStore(undefined)
    GlobalReduxable.setStore(undefined)
  })

  describe('combined with scoped reduxables', () => {
    it('should take all the actions with the same type name', () => {
      const globalCounter1 = new GlobalReduxable({ increment: state => state + 1 }, 0)
      const globalCounter2 = new GlobalReduxable({ increment: state => state + 1 }, 0)
      const store = createStore(combineReducers({ globalCounter1, globalCounter2 }))
      GlobalReduxable.setStore(store)

      globalCounter1.increment()
      expect(store.getState()).toEqual({ globalCounter1: 1, globalCounter2: 1 })

      globalCounter2.increment()
      expect(store.getState()).toEqual({ globalCounter1: 2, globalCounter2: 2 })
    })
  })

  describe('combined with scoped reduxables', () => {
    it('should take also the scoped actions', () => {
      const scopedCounter = new Reduxable({ increment: state => state + 1 }, 0)
      const globalCounter = new GlobalReduxable({ increment: state => state + 1 }, 0)
      const store = createStore(combineReducers({ scopedCounter, globalCounter }))
      Reduxable.setStore(store)
      GlobalReduxable.setStore(store)

      scopedCounter.increment()
      expect(scopedCounter.getState()).toEqual(1)
      expect(globalCounter.getState()).toEqual(1)
      expect(store.getState()).toEqual({ scopedCounter: 1, globalCounter: 1 })

      globalCounter.increment()
      expect(scopedCounter.getState()).toEqual(1)
      expect(globalCounter.getState()).toEqual(2)
      expect(store.getState()).toEqual({ scopedCounter: 1, globalCounter: 2 })
    })
  })
})
