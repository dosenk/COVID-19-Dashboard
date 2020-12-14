export default class Table {
  constructor(parentElement, observer) {
    parentElement.append('table');

    this.observer = observer;
    observer.subscribe(this);
  }

  start() {
    this.observer.actions.fetchCountryData();
  }

  update(state) {
    console.log(state);
  }
}
