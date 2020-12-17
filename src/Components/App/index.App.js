import Table from '../Table/index.Table';
import Observer from '../../Observer/index.Observer';
import Map from '../../Map/index.Map';

export default class App {
  constructor() {
    const parentElement = document.body;
    this.observer = new Observer();

    this.table = new Table(parentElement, this.observer);
    this.map = new Map(parentElement, this.observer);
  }

  async start() {
    this.observer.actions.fetchApiData();

    this.table.start();
    this.map.start();
  }
}
