import Todos from './Todos'
const { addTodo, toggleTodo } = Todos.reducers

describe('Todos reduxable', () => {
  it('should start with correct initial state', () => {
    expect(new Todos().state).toEqual([])
  })

  it('addTodo should add a new todo', () => {
    expect(addTodo([], 'Run the tests')).toEqual([
      {
        text: 'Run the tests',
        completed: false,
        id: 0,
      },
    ])

    expect(
      addTodo(
        [
          {
            text: 'Run the tests',
            completed: false,
            id: 0,
          },
        ],
        'Use Reduxable',
      ),
    ).toEqual([
      {
        text: 'Run the tests',
        completed: false,
        id: 0,
      },
      {
        text: 'Use Reduxable',
        completed: false,
        id: 1,
      },
    ])
  })

  it('toggleTodo should toggle the todo', () => {
    expect(
      toggleTodo(
        [
          {
            text: 'Run the tests',
            completed: false,
            id: 1,
          },
          {
            text: 'Use Redux',
            completed: false,
            id: 0,
          },
        ],
        1,
      ),
    ).toEqual([
      {
        text: 'Run the tests',
        completed: true,
        id: 1,
      },
      {
        text: 'Use Redux',
        completed: false,
        id: 0,
      },
    ])
  })
})
