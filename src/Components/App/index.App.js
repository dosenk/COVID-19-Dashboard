import Table from '../Table/index.Table';
import Chart from '../Chart/index.Chart';
import Observer from '../../Observer/index.Observer';
import Slider from '../Slider/index.Slider';

export default class App {
  constructor() {
    const parentElement = document.body;
    this.observer = new Observer();

    this.table = new Table(parentElement, this.observer);
    this.chart = new Chart(parentElement, this.observer);
    this.sliderChart = new Slider(this.chart.getContainer(), this.observer, 'chart-slider');
  }

  async start() {
    this.observer.actions.fetchApiData();

    this.table.start();
    this.chart.start(this.sliderChart);
  }
}
