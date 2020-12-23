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
    this.mainElement = document.createElement('main');
    this.infoBlock = document.createElement('section');

    this.observer = new Observer();

    this.map = new Map(
      createContainer(this.infoBlock, MAP_CLASSNAME),
      this.observer,
    );
    this.table = new Table(
      createContainer(this.infoBlock, TABLE_CLASSNAME),
      this.observer,
    );
    this.list = new CountryList(
      createContainer(this.mainElement, LIST_CLASSNAME),
      this.observer,
    );
    this.chart = new Chart(
      createContainer(this.infoBlock, CHART_CLASSNAME),
      this.observer,
    );

    renderHeader(document.body);
    this.mainElement.append(this.infoBlock);
    document.body.append(this.mainElement);
    renderFooter(document.body);
  }

  async start() {
    this.observer.actions.fetchApiData();

    this.chart.start();
    this.map.start();
    this.list.start();
  }
}
