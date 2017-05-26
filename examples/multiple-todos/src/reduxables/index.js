import { ReduxableSet } from 'reduxable'
import Todos from './Todos'
import VisibilityFilter from './VisibilityFilter'

class TodoApp extends ReduxableSet {
  constructor() {
    super({
      todos: new Todos(),
      visibilityFilter: new VisibilityFilter(),
    })
  }

  addTodo = text => {
    console.log('este', this)
    this.todos.addTodo(text)
  }

  toggleTodo = todoId => this.todos.toggleTodo(todoId)

  getVisibleTodos = () => {
    console.warn('a ver', this)
    const { todos, visibilityFilter } = this.getState()

    switch (visibilityFilter) {
      case 'SHOW_ALL':
        return todos
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed)
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed)
      default:
        throw new Error('Unknown filter: ' + visibilityFilter)
    }
  }
}

export default TodoApp
