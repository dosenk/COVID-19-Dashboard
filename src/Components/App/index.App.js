import Table from '../Table/index.Table';
import Observer from '../../Observer/index.Observer';

export default class App {
  constructor() {
    const parentElement = document.body;
    this.observer = new Observer();

    this.table = new Table(parentElement, this.observer);
  }

  async start() {
    queueMicrotask(() => this.observer.actions.fetchAllCovidInfo());

    this.table.start();
  }
}
