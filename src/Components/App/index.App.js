import Table from '../Table/index.Table';
import List from '../List/index.List';
import Chart from '../Chart/index.Chart';
import Observer from '../../Observer/index.Observer';
import Map from '../Map/index.Map';
import renderFooter from '../Footer/footer';
import renderHeader from '../Header/header';
import createContainer from '../fullscreenWrapper/index.ComponentWrapper';
import {
  CHART_CLASSNAME,
  MAP_CLASSNAME,
  TABLE_CLASSNAME,
  LIST_CLASSNAME,
} from '../../Constants/classNames';

export default class App {
  constructor() {
    this.mainElement = document.createElement('main');
    this.observer = new Observer();

    this.table = new Table(
      createContainer(this.mainElement, TABLE_CLASSNAME),
      this.observer,
    );
    this.list = new List(
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

    document.body.append(this.mainElement);
  }

  async start() {
    this.observer.actions.fetchApiData();
    renderHeader(this.mainElement);
    this.table.start();
    this.list.start();
    this.chart.start();
    this.map.start();
    renderFooter(this.mainElement);
  }
}
