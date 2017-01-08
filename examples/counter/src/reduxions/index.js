import Reduxion from 'reduxion'

export default class CounterReduxion extends Reduxion {
  state = 0

  reducers = {
    increment: state => state + 1,
    decrement: state => state - 1,
  }
}


















  // THIS in the reducers

    //add: (state, action) => state + action.value,

  // THIS as a method

  //add(value) {
  //  this.boundedActions.add({ value })
  //}


















/* IDEAL!!
// 1) reducers as class methods, not inside an object
// 2) reducers in camelCase (then exported as UPPERCASE)

export default class CounterReduxion extends Reduxion {
  //id = Symbol("counter")
  state = 0   // or _state if the user want to have a `state()` method

  increment = () => this.state + 1
  decrement = () => this.state - 1
}


// THEN IN THE CONFIGURE STORE SOMETHIN LIKE
{
  counter: new CounterReduxion().reducer
}

*/




/* IDEAL!! OTHER APPROACH
// 1) reducers into an object
// 2) actions creators defined as instance methods

export default class CounterReduxion extends Reduxion {
  //id = Symbol("counter")
  state = 0   // or _state if the user want to have a `state()` method

  reducers {
    increment = () => this.state + 1
    decrement = () => this.state - 1
  }

  increment = ({ ...args }) => dispatch({ type: 'INCREMENT', ...args })
}


// THEN IN THE CONFIGURE STORE SOMETHIN LIKE
{
  counter: new CounterReduxion().reducer
}

*/