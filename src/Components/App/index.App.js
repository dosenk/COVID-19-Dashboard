import Table from '../Table/index.Table';
import Chart from '../Chart/index.Chart';
import Observer from '../../Observer/index.Observer';
import Map from '../Map/index.Map';

export default class App {
  constructor() {
    const parentElement = document.body;
    this.observer = new Observer();

    this.table = new Table(parentElement, this.observer);
    this.map = new Map(parentElement, this.observer);
    this.chart = new Chart(parentElement, this.observer);
  }

  async start() {
    this.observer.actions.fetchApiData();

    this.table.start();
    this.chart.start();
    this.map.start();
  }
}
