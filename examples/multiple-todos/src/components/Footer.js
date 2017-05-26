import React from 'react'
import FilterLink from '../containers/FilterLink'

const Footer = ({ todoApp }) => (
  <p>
    Show:
    {' '}
    <FilterLink filter="SHOW_ALL" todoApp={todoApp}>
      All
    </FilterLink>
    {', '}
    <FilterLink filter="SHOW_ACTIVE" todoApp={todoApp}>
      Active
    </FilterLink>
    {', '}
    <FilterLink filter="SHOW_COMPLETED" todoApp={todoApp}>
      Completed
    </FilterLink>
  </p>
)

export default Footer
