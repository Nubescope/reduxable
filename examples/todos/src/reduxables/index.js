import { ReduxableSet } from 'reduxable'
import Todos from './Todos'
import VisibilityFilter from './VisibilityFilter'

const todoApp = new ReduxableSet({
  todos: new Todos(),
  visibilityFilter: new VisibilityFilter(),
})

export default todoApp
