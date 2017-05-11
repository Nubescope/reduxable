import CounterReduxion from './index'
const { increment, decrement } = CounterReduxion.reducers

describe('reducers', () => {
  describe('increment', () => {
    it('should return the old number incremented by 1', () => {
      expect(increment(0)).toBe(1)
      expect(increment(-10)).toBe(-9)
      expect(increment(10)).toBe(11)
    })
  })

  describe('decrement', () => {
    it('should return the old number decremented by 1', () => {
      expect(decrement(0)).toBe(-1)
      expect(decrement(-10)).toBe(-11)
      expect(decrement(10)).toBe(9)
    })
  })
})
