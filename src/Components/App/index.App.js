import Table from '../Table/index.Table';
import Chart from '../Chart/index.Chart';
import Observer from '../../Observer/index.Observer';
<<<<<<< HEAD
import Slider from '../Slider/index.Slider';
=======
import Map from '../Map/index.Map';
>>>>>>> 6cf5d84d4577f415d10c76f17c1c55f18d78ce68

export default class App {
  constructor() {
    const parentElement = document.body;
    this.observer = new Observer();

    this.table = new Table(parentElement, this.observer);
<<<<<<< HEAD
    this.chart = new Chart(parentElement, this.observer);
    this.sliderChart = new Slider(this.chart.getContainer(), this.observer, 'chart-slider');
=======
    this.map = new Map(parentElement, this.observer);
>>>>>>> 6cf5d84d4577f415d10c76f17c1c55f18d78ce68
  }

  async start() {
    this.observer.actions.fetchApiData();

    this.table.start();
<<<<<<< HEAD
    this.chart.start(this.sliderChart);
=======
    this.map.start();
>>>>>>> 6cf5d84d4577f415d10c76f17c1c55f18d78ce68
  }
}
