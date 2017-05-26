import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'

const App = ({ todoApp }) => (
  <div>
    <AddTodo todoApp={todoApp} />
    <VisibleTodoList todoApp={todoApp} />
    <Footer todoApp={todoApp} />
  </div>
)

export default App
