import { NEW_RECOVERED } from '../../Observer/dataTypes';

export default class Table {
  constructor(parentElement, observer) {
    parentElement.append('table');

    this.observer = observer;
    observer.subscribe(this);
  }

  start() {
    setTimeout(() => {
      this.observer.actions.setDataType(NEW_RECOVERED);
    }, 2000);

    setTimeout(() => {
      this.observer.actions.setCountry('Poland');
    }, 2100);
  }

  update(state) {
    console.log(state);
  }
}
