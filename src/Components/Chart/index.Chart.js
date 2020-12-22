import ChartJS from 'chart.js';

export default class Chart {
  constructor(parentElement, observer) {
    this.parentElement = parentElement;
    this.observer = observer;
    observer.subscribe(this);
    this.container = Chart.createContainer();
  }

  start(slider) {
    this.parentElement.append(this.container);
    this.ctx = document.getElementById('myChart').getContext('2d');
    slider.start();
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

  static createContainer() {
    const container = document.createElement('div');
    container.classList.add('chart');
    const canvas = document.createElement('canvas');
    canvas.id = 'myChart';
    canvas.width = 600;
    canvas.height = 500;
    container.append(canvas);
    return container;
  }

  getContainer() {
    return this.container;
  }

  render(countryCases, dataType) {
    this.chartData = countryCases
      .map((elem) => elem[dataType])
      .reverse();
    this.chartDates = countryCases
      .map((elem) => new Date(elem.date)
        .toLocaleDateString())
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
        datasets: [{
          label: 'cases',
          data: chartDataX,
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

  updateData(chartDataX, chartDataY) {
    this.myChart.data.datasets[0].data = chartDataX;
    this.myChart.data.labels = chartDataY;
    this.myChart.update();
  }
}
