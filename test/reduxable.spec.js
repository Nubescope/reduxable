import Reduxable, { createStore } from '../src'

class WithoutGetReducer extends Reduxable {}

class GetReducerReturningUndefined extends Reduxable {
  getReducer() {
    return
  }
}

class GetReducerReturningNull extends Reduxable {
  getReducer() {
    return null
  }
}

class GetReducerReturningNumber extends Reduxable {
  getReducer() {
    return 1
  }
}

class GetReducerReturningString extends Reduxable {
  getReducer() {
    return 'foo'
  }
}

class GetReducerReturningFunction extends Reduxable {
  getReducer() {
    return function() {}
  }
}

class GetReducerReturningValidReduxable extends Reduxable {
  getReducer() {
    return new GetReducerReturningFunction()
  }
}

class GetReducerReturningInvalidReduxable extends Reduxable {
  getReducer() {
    return new GetReducerReturningString()
  }
}

class GetReducerReturningEmptyObject extends Reduxable {
  getReducer() {
    return {}
  }
}

class GetReducerReturningValidObject extends Reduxable {
  getReducer() {
    return {
      valid: new GetReducerReturningFunction(),
    }
  }
}

class GetReducerReturningInvalidObject extends Reduxable {
  getReducer() {
    return {
      valid: new GetReducerReturningFunction(),
      invalid: 'invalid member',
    }
  }
}

class IdentityFunctionReduxable extends Reduxable {
  getReducer() {
    return (state = {}) => state
  }
}

class IdentityReduxableReduxable extends Reduxable {
  getReducer() {
    return new IdentityFunctionReduxable()
  }
}

class ComposedObjectReduxable extends Reduxable {
  getReducer() {
    return {
      identityReduxable: new IdentityFunctionReduxable(),
      identityFunction: (state = {}) => state,
    }
  }
}

describe('Reduxable', () => {
  beforeEach(() => {
    Reduxable.setStore(undefined)
  })

  describe('assertions', () => {
    it('should throw error if has not `getReducer` method', () => {
      expect(() => new WithoutGetReducer()).toThrowError('You must define a `getReducer` method')
    })

    it('should throw error if `getReducer` returns undefined', () => {
      expect(() => new GetReducerReturningUndefined()).toThrowError(/You are returning undefined/)
    })

    it('should throw error if `getReducer` returns null', () => {
      expect(() => new GetReducerReturningNull()).toThrowError(/You are returning null/)
    })

    it('should throw error if `getReducer` returns a number', () => {
      expect(() => new GetReducerReturningNumber()).toThrowError(/You are returning number/)
    })

    it('should throw error if `getReducer` returns a string', () => {
      expect(() => new GetReducerReturningString()).toThrowError(/You are returning string/)
    })

    it('should pass if `getReducer` returns a function', () => {
      new GetReducerReturningFunction()
    })

    it('should pass if `getReducer` returns a valid Reduxable', () => {
      new GetReducerReturningValidReduxable()
    })

    it('should throw error if `getReducer` returns an invalid Reduxable', () => {
      expect(() => new GetReducerReturningInvalidReduxable()).toThrowError(/You are returning string/)
    })

    it('should throw error if `getReducer` returns an empty object', () => {
      expect(() => new GetReducerReturningEmptyObject()).toThrowError(/You are returning an empty object/)
    })

    it('should pass if `getReducer` returns a valid object', () => {
      new GetReducerReturningValidObject()
    })

    it('should throw error if `getReducer` returns an invalid object', () => {
      expect(() => new GetReducerReturningInvalidObject()).toThrowError()
    })
  })

  describe('reduce method', () => {
    it('should honor the function returned by the `getReducer` method', () => {
      const reduxable = new IdentityFunctionReduxable()
      expect(reduxable.reduce('TEST')).toEqual('TEST')
    })

    it('should honor the Reduxable returned by the `getReducer` method', () => {
      const reduxable = new IdentityReduxableReduxable()
      expect(reduxable.reduce('TEST')).toEqual('TEST')
    })

    it('should honor all the reducers/reduxables returned by the `getReducer` method', () => {
      const reduxable = new ComposedObjectReduxable()
      expect(reduxable.reduce()).toEqual({ identityReduxable: {}, identityFunction: {} })
      expect(
        reduxable.reduce({
          identityReduxable: 'TEST_1',
          identityFunction: 'TEST_2',
        })
      ).toEqual({
        identityReduxable: 'TEST_1',
        identityFunction: 'TEST_2',
      })
    })
  })
})
