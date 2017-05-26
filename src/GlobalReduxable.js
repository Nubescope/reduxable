import Reduxable from './Reduxable'

class GlobalReduxable extends Reduxable {}
GlobalReduxable._global = true

export default GlobalReduxable
