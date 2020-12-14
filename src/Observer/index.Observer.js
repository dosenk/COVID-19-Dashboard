import ActionCreator from './ActionCreator';
import reducer from './reducer';

export default class Observer {
  constructor(initialState = {}) {
    this.state = initialState;
    this.subscribers = [];
    this.actions = new ActionCreator(this);
  }

  dispatch(action) {
    this.state = reducer(this.state, action);
    this.subscribers.forEach(subscriber => {
      subscriber.update(this.state);
    });
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }

  getState() {
    return this.state;
  }
}
