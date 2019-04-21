# Sample Redux

This is the simple implementation of Redux. Only implemented the `createStore()` and `combineReducers`. Code based on Dan Abramov's [Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux) lecture.

## createStore
Take a `reducer` function (so `createStore` itself is a higher order function) and return a object (store) with three methods `getState`, `subscribe` and `dispatch`.

```Javascript
const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    ...
  };

  const subscribe = (listener) => {
    //...
  };

  dispatch({});

  return {
    getState,
    dispatch,
    subscribe
  };
};
```
Call `createStore` will create a closure, so user cannot access `state` and `listeners` array from outside.

`state` is the state for the whole store, and listener is an array store the callback function which will be called after each dispatch.

### `getState`
```javascript
  const getState = () => state;
```
Return the current state.

### `dispatch`
```javascript
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.map((listener) => listener());
  };
```
`action` is a action object tell reducer which action should be dispatched. In Redux, this object must have a `type` property, normally use `String`. `reducer` is function 'reduce' old state and action to new state. **Reducer must be a pure function**, which means it not change the input data (oldState, action), and return a new state.

Redux is basically an observer pattern, the store is the subject and each components (or whatever use the state) is the observer. So after each state change, the store run listeners in listeners array to notify the state change.

### `subscribe()`
```javascript
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
        listeners = listeners.filter((l) => l !== listener);
    }
  };
```
This is the function use to register the listener. For example, we can do something like `store.subscribe(this.forceUpdate())` in React components' `componentDidMount()`.

The interesting part is that this is no `unsubscribe` function in store, but the `subscribe` function itself is a higher order function return a function which is used to unsubscribe the given listener. The largest benefit is that the new function keep a reference of the listener, so it's easy to remove the listener. For example, in a React component, we can do that:

```javascript
componentDidMount() {
  this.unsubscribe = store.subscribe(this.forceUpdate());
}

componentWillMount() {
  if (this.unsubscribe) {
    this.unsubscribe();
  }
}
```

## combineReducers
```javascript
const combineReducers = (reducers) => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](
        state[key],
        action
      );

      return nextState;
    }, {});
  }
};
```

This is a higher order function take an object of functions (reducers) and return a new reducer functon. As a normal reducer, the new reducer take old state and action object as argumnets. It will loop through all reducers and call each reducer and accumulate each reducer's new state to create a new state. So if you use `combineReducers`, the state in the store is something like:
```javascript
{
  reducer1: { /**reducer1's state**/ },
  reducer2: { /**reducer2's state**/ },
  //...
}
```

## Some Resource
- [Higher Order Function](https://www.oreilly.com/library/view/functional-javascript/9781449360757/ch04.html)
- [Observer Pattern](https://www.dofactory.com/javascript/observer-design-pattern)
- [Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux)
- [Redux](https://redux.js.org/)
