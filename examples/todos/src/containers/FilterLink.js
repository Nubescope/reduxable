import { connect } from 'react-redux'
import app from '../reduxables'
import Link from '../components/Link'

const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.visibilityFilter,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    app.visibilityFilter.setVisibilityFilter(ownProps.filter)
  },
})

const FilterLink = connect(mapStateToProps, mapDispatchToProps)(Link)

export default FilterLink
