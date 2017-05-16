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

export function assertReducerName(reduxable, reducerName) {
  if (reduxable[reducerName] !== undefined) {
    throw new Error(
      `You are defining a reducer and a method with the same name '${reducerName}'.\n` +
        `You need to change the reducer or the method name.`
    )
  }
}

export function assertReduxableSetChildren(children) {
  if (children === null) {
    throw new Error(`The children must be an object and it is 'null'`)
  }

  if (!children) {
    throw new Error(`You must provide the children as the first parameter of ReduxableSet constructor`)
  }

  if (typeof children !== 'object') {
    throw new Error(`The children must be an object and it is '${children}'`)
  }

  if (Object.keys(children).length === 0) {
    throw new Error(`The children must not be empty`)
  }
}
