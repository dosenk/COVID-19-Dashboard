import ActionCreator from './ActionCreator';
import { INIT } from './actionTypes';
import reducer from './reducer';

export default class Observer {
  constructor(initialState = {}) {
    this.state = reducer(initialState, { type: INIT });
    this.subscribers = [];
    this.actions = new ActionCreator(this);
  }

  dispatch(action) {
    this.state = reducer(this.state, action);
    this.subscribers.forEach((subscriber) => {
      subscriber.update(this.state, action.type);
    });
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }

  getState() {
    return this.state;
  }
}
