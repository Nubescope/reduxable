import Reduxable, { createStore, combineReducers } from '../src'
import GlobalReduxable from '../src/GlobalReduxable'

describe('GlobalReduxable', () => {
  beforeEach(() => {
    Reduxable._setStore(undefined)
    GlobalReduxable._setStore(undefined)
  })

  afterAll(() => {
    Reduxable._setStore(undefined)
    GlobalReduxable._setStore(undefined)
  })

  describe('combined with scoped reduxables', () => {
    it('should take all the actions with the same type name', () => {
      const globalCounter1 = new GlobalReduxable(0, { increment: state => state + 1 })
      const globalCounter2 = new GlobalReduxable(0, { increment: state => state + 1 })
      const store = createStore(combineReducers({ globalCounter1, globalCounter2 }))
      GlobalReduxable._setStore(store)

      globalCounter1.reducers.increment()
      expect(store.getState()).toEqual({ globalCounter1: 1, globalCounter2: 1 })

      globalCounter2.reducers.increment()
      expect(store.getState()).toEqual({ globalCounter1: 2, globalCounter2: 2 })
    })
  })

  describe('combined with scoped reduxables', () => {
    it('should take also the scoped actions', () => {
      const scopedCounter = new Reduxable(0, { increment: state => state + 1 })
      const globalCounter = new GlobalReduxable(0, { increment: state => state + 1 })
      const store = createStore(combineReducers({ scopedCounter, globalCounter }))
      Reduxable._setStore(store)
      GlobalReduxable._setStore(store)

      scopedCounter.reducers.increment()
      expect(scopedCounter.state).toEqual(1)
      expect(globalCounter.state).toEqual(1)
      expect(store.getState()).toEqual({ scopedCounter: 1, globalCounter: 1 })

      globalCounter.reducers.increment()
      expect(scopedCounter.state).toEqual(1)
      expect(globalCounter.state).toEqual(2)
      expect(store.getState()).toEqual({ scopedCounter: 1, globalCounter: 2 })
    })
  })
})
