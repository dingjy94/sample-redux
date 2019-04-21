import { createStore, combineReducers } from './index';

const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

const stringReducer = (state = '', action) => {
  switch (action.type) {
    case 'ADD_A':
      return state + 'A';
    default:
      return state;
  }
};

describe('Simple Redux', () => {
  const store = createStore(counter);

  it('getState return current state', () => {
    expect(store.getState()).toBe(0);
  });
  it('dispatch dispatch specify action to change state', () => {
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(1);
  })
  it('subscribed callback is called after dispatch', () => {
    const mockFunc = jest.fn();
    store.subscribe(mockFunc);
    store.dispatch({ type: 'DECREMENT' });

    expect(mockFunc).toHaveBeenCalled();
  });
});

describe('Siple Redux combine reducer', () => {
  const rootReducer = combineReducers({
    counter,
    string: stringReducer
  });

  const store = createStore(rootReducer);

  it('getState should return a state object', () => {
    expect(store.getState()).toMatchObject({
      counter: 0,
      string: ''
    });
  });

  it('dispatch INCREMENT should only influence counter', () => {
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toMatchObject({
      counter: 1,
      string: ''
    });
  });

  it('dispatch ADD_A should only influence string', () => {
    store.dispatch({ type: 'ADD_A' });
    expect(store.getState()).toMatchObject({
      counter: 1,
      string: 'A'
    });
  })
});


