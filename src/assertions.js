export function assertReducersObject(reducers) {
  if (reducers === null) {
    throw new Error(`The reducers must be an object and it is 'null'`)
  }

  if (!reducers) {
    throw new Error(
      `You must provide the 'reducers' as:\n` +
        ` - the first parameter of Reduxable constructor\n` +
        ` - setting the static 'reducers' to your class`
    )
  }

  if (typeof reducers !== 'object') {
    throw new Error(`The reducers must be an object and it is '${reducers}'`)
  }

  if (Object.keys(reducers).length === 0) {
    throw new Error(`The reducers must not be empty`)
  }
}

export function assertState(state) {
  if (state === undefined) {
    throw new Error(
      `You must provide the 'initial state' as:\n` +
        ` - the second parameter of Reduxable constructor\n` +
        ` - setting the static 'state' to your class`
    )
  }
}
