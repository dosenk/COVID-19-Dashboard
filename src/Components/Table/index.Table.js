import Slider from '../Slider/index.Slider';
import {
  TABLE_CLASS,
  TABLE_WRAPPER_CLASS,
  THEAD_CATEGORIES,
  THEAD_TBODY_CATEGORIES,
} from './constants';

export default class Table {
  constructor(parentElement, observer) {
    this.parentElement = parentElement;
    this.slider = new Slider(observer, true);
    this.observer = observer;
    observer.subscribe(this);
    this.createContainer();
    this.parentElement.append(this.slider.getContainer());
    this.slider.start();
  }

  update(state) {
    this.updateData(state);
  }

  createContainer() {
    this.container = document.createElement('section');
    this.container.className = TABLE_CLASS;
    const tableWrapper = document.createElement('div');
    tableWrapper.className = TABLE_WRAPPER_CLASS;
    const table = document.createElement('table');
    const tableCaption = document.createElement('caption');
    this.tableCaptionCountry = document.createElement('div');
    this.tableCaptionCountry.className = 'country-name';
    this.tableCaptionFlag = document.createElement('img');
    this.tableCaptionFlag.className = 'country-flag';
    tableCaption.append(this.tableCaptionCountry, this.tableCaptionFlag);
    const tableHead = document.createElement('thead');
    const tableHeadTr = document.createElement('tr');
    THEAD_CATEGORIES.forEach((cat) => {
      const th = document.createElement('th');
      th.innerText = cat;
      tableHeadTr.append(th);
    });
    tableHead.append(tableHeadTr);
    const tableBody = document.createElement('tbody');
    THEAD_TBODY_CATEGORIES.forEach((arr) => {
      const tr = document.createElement('tr');
      for (let i = 0; i < 3; i += 1) {
        const td = document.createElement('td');
        if (i === 0) td.innerText = arr[i];
        else {
          td.setAttribute('data', arr[i][0]);
          td.setAttribute('data-th', arr[i][1]);
        }
        tr.append(td);
      }
      tableBody.append(tr);
    });
    table.append(tableCaption, tableHead, tableBody);
    tableWrapper.append(this.table);
    this.container.append(tableWrapper);
    this.parentElement.append(table);
  }

  updateData(state) {
    try {
      const perThFlag = state.dataType.indexOf('100') >= 0;
      const { country } = state;
      const resultData = country === 'All'
        ? state.data.Global[0]
        : state.data.Countries.get(country);
      if (resultData !== undefined) {
        this.setData(resultData, country, perThFlag);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Country not found');
    }
  }

  setData(data, country, perThFlag) {
    this.tableCaptionCountry.innerText = country === 'All' ? `All World ${data.date}` : `${country}  ${data.date}`;
    if (data.flag) {
      this.tableCaptionFlag.classList.add('active-flag');
      this.tableCaptionFlag.src = data.flag;
    }
    const allTd = document.querySelectorAll('*[data]');
    allTd.forEach((item) => {
      const td = item;
      const dataAttr = perThFlag
        ? td.getAttribute('data-th')
        : td.getAttribute('data');
      td.innerText = data[dataAttr];
    });
  }
}
