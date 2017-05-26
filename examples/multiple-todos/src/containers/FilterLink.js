import { connect } from 'react-redux'
import Link from '../components/Link'

const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.visibilityFilter,
})

const mapDispatchToProps = (dispatch, { todoApp, filter }) => ({
  onClick: () => {
    todoApp.visibilityFilter.setVisibilityFilter(filter)
  },
})

const FilterLink = connect(mapStateToProps, mapDispatchToProps)(Link)

export default FilterLink
