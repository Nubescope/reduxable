import Reduxable from './Reduxable'

class GlobalReduxable extends Reduxable {}
GlobalReduxable.global = true

export default GlobalReduxable
