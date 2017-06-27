import Reduxable from 'reduxable'

class Todos extends Reduxable {
  constructor() {
    super([])
  }

  addTodo = text => this.reducers.addTodo(text)
  toggleTodo = id => this.reducers.toggleTodo(id)
}

let nextTodoId = 0
Todos.reducers = {
  addTodo: (state, text) => [...state, { id: nextTodoId++, text, completed: false }],

  toggleTodo: (state, id) =>
    state.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed }
      } else {
        return todo
      }
    }),
}

export default Todos
