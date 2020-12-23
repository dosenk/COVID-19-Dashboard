import ChartJS from 'chart.js';
import Slider from '../Slider/index.Slider';
import HOVER_BACKGROUND_COLOR from './constants';

export default class Chart {
  constructor(parentElement, observer) {
    this.parentElement = parentElement;
    this.slider = new Slider(observer);
    this.observer = observer;
    observer.subscribe(this);
    this.createContainer();
  }

  start() {
    this.container.append(this.slider.getContainer());
    this.parentElement.append(this.container);
    this.slider.start();
    this.ctx = document.getElementById('myChart').getContext('2d');
  }

  update(state) {
    try {
      const recivedState = state;
      const { dataType } = recivedState;
      const countryCases = recivedState.country === 'All'
        ? recivedState.data.Global
        : recivedState.data.Countries.get(recivedState.country).timeline;
      this.render(countryCases, dataType);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Country not found');
    }
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.classList.add('chart');
    const canvas = document.createElement('canvas');
    canvas.id = 'myChart';
    canvas.width = 350;
    canvas.height = 350;
    this.container.append(canvas);
  }

  render(countryCases, dataType) {
    this.chartData = countryCases.map((elem) => elem[dataType]).reverse();
    this.chartDates = countryCases
      .map((elem) => new Date(elem.date).toLocaleDateString())
      .reverse();
    if (this.myChart === undefined) {
      this.addData(this.chartData, this.chartDates);
    } else {
      this.updateData(this.chartData, this.chartDates);
    }
  }

  addData(chartDataX, chartDataY) {
    this.myChart = new ChartJS(this.ctx, {
      type: 'bar',
      data: {
        labels: chartDataY,
        datasets: [
          {
            label: 'cases',
            data: chartDataX,
            barPercentage: 1,
            categoryPercentage: 1,
            hoverBackgroundColor: HOVER_BACKGROUND_COLOR,
          },
        ],
      },
      options: {
        responsive: false,
      },
    });
  }

  updateData(chartDataX, chartDataY) {
    this.myChart.data.datasets[0].data = chartDataX;
    this.myChart.data.labels = chartDataY;
    this.myChart.update();
  }
}
