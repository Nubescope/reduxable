import { Reducer } from '../src'

class Counter extends Reducer {
  increment(state) { return  state + 1 }
  decrement(state) { return state - 1 }
  addOne(state) { return  state + 1 }
}

const counterReducer = new Counter()

describe('Reducer', () => {
  describe('actions', () => {
    it('returns an action as plain object when calling an existent method', () => {
      const incrementAction = counterReducer.actions.increment()
      expect(incrementAction).toEqual({ type: 'INCREMENT' })
    })

    it('should work with "two words" methods', () => {
      const incrementAction = counterReducer.actions.addOne()
      expect(incrementAction).toEqual({ type: 'ADD_ONE' })
    })

    it('throws an exception if method not exists', done => {
      try {
        counterReducer.actions.notExistentMethod()
      } catch (e) {
        expect(e.message).toEqual('counterReducer.actions.notExistentMethod is not a function')
        done()
      }
    })
  })
})
