/* eslint-disable class-methods-use-this */
import ChartJS from 'chart.js';
import Fetcher from '../../Fetcher/index.Fetcher';
import { COVID_API, COUNTRY_INFO_API } from '../../Constants/index.Constants';

export default class Chart {
  constructor(parentElement, observer) {
    this.fetcher = new Fetcher(COVID_API, COUNTRY_INFO_API);
    this.observer = observer;
    observer.subscribe(this);
  }

  start() {
    this.ctx = document.getElementById('myChart').getContext('2d');
  }

  async update(state) {
    const recivedState = state;
    const dataType = recivedState.dataType.slice(5);
    const countryCases = await this.fetcher.getCovidInfoByCountryPeriod('Poland');
    this.render(countryCases, dataType);
  }

  render(countryCases, dataType) {
    this.chartData = countryCases.data.map((elem) => elem[dataType]);
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
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false,
            },
          }],
        },
      },
    });
  }
}
