import ChartJS from 'chart.js';
import Fetcher from '../../Fetcher/index.Fetcher';
import { COVID_API, COUNTRY_INFO_API } from '../../Constants/index.Constants';

export default class Chart {
  constructor(parentElement, observer) {
    this.parentElement = parentElement;
    this.fetcher = new Fetcher(COVID_API, COUNTRY_INFO_API);
    this.observer = observer;
    observer.subscribe(this);
    this.createContainer();
  }

  start(slider) {
    this.ctx = document.getElementById('myChart').getContext('2d');
    slider.start();
  }

  async update(state) {
    const recivedState = state;
    const dataType = recivedState.dataType.slice(5);
    const countryCases = await this.fetcher.getCovidInfoByCountryPeriod(recivedState.country);
    this.render(countryCases, dataType);
  }

  createContainer() {
    this.chartContainer = document.createElement('div');
    this.chartContainer.classList.add('chart');
    const canvas = document.createElement('canvas');
    canvas.id = 'myChart';
    canvas.width = 600;
    canvas.height = 500;
    this.chartContainer.append(canvas);
    this.parentElement.append(this.chartContainer);
  }

  getContainer() {
    return this.chartContainer;
  }

  render(countryCases, dataType) {
    this.chartData = countryCases.data.map((elem) => elem[dataType.toLowerCase()]);
    this.chartDates = countryCases.data.map((elem) => new Date(elem.Date).toLocaleDateString());
    this.myChart = new ChartJS(this.ctx, {
      type: 'bar',
      data: {
        labels: this.chartDates,
        datasets: [{
          label: 'cases',
          data: this.chartData,
          barPercentage: 1,
          categoryPercentage: 1,
          hoverBackgroundColor: 'rgba(255, 99, 55, 1)',
        }],
      },
      options: {
        responsive: false,
      },
    });
  }
}
