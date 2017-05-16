import { connect } from 'react-redux'
import app from '../reduxables'
import TodoList from '../components/TodoList'

const mapStateToProps = () => ({
  todos: app.getVisibleTodos(),
  onTodoClick: app.toggleTodo,
})

const VisibleTodoList = connect(mapStateToProps)(TodoList)

export default VisibleTodoList
