import { createReducer } from '../src'

const counterReduce = createReducer({
  increment: state => state + 1,
  decrement: state => state - 1,
})

const counterReduceWithInitialValue = createReducer(
  {
    increment: state => state + 1,
    decrement: state => state - 1,
  },
  1000
)

const incrementAction = { type: 'increment' }
const decrementAction = { type: 'decrement' }
const unhandledAction = { type: 'UNHANDLED' }

describe('createReducer', () => {
  it('should work without initialState', () => {
    expect(counterReduce()).toEqual(undefined)
    expect(counterReduce(null, unhandledAction)).toEqual(null)
    expect(counterReduce(10, unhandledAction)).toEqual(10)
    expect(counterReduce(0, incrementAction)).toEqual(1)
    expect(counterReduce(10, incrementAction)).toEqual(11)
    expect(counterReduce(0, decrementAction)).toEqual(-1)
    expect(counterReduce(10, decrementAction)).toEqual(9)
  })

  it('should work with initialState', () => {
    expect(counterReduceWithInitialValue()).toEqual(1000)
  })
})
