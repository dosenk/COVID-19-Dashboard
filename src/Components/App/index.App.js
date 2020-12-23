import Table from '../Table/index.Table';
import Chart from '../Chart/index.Chart';
import Observer from '../../Observer/index.Observer';
import Map from '../Map/index.Map';
import renderFooter from '../Footer/footer';
import renderHeader from '../Header/header';
import createContainer from '../fullscreenWrapper/index.ComponentWrapper';
import {
  CHART_CLASSNAME,
  LIST_CLASSNAME,
  MAP_CLASSNAME,
  TABLE_CLASSNAME,
} from '../../Constants/classNames';
import CountryList from '../CountryList/index.CountryList';

export default class App {
  constructor() {
    const parentElem = document.body;
    this.mainElement = document.createElement('main');
    this.observer = new Observer();

    this.table = new Table(
      createContainer(this.mainElement, TABLE_CLASSNAME),
      this.observer,
    );
    this.list = new CountryList(
      createContainer(this.mainElement, LIST_CLASSNAME),
      this.observer,
    );
    this.chart = new Chart(
      createContainer(this.mainElement, CHART_CLASSNAME),
      this.observer,
    );
    this.map = new Map(
      createContainer(this.mainElement, MAP_CLASSNAME),
      this.observer,
    );

    renderHeader(parentElem);
    parentElem.append(this.mainElement);
    renderFooter(parentElem);
  }

  async start() {
    this.observer.actions.fetchApiData();
    this.chart.start();
    this.map.start();
    this.list.start();
  }
}
