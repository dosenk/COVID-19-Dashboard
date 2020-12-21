import {
  LEFT_ARROW, RIGHT_ARROW, MAIN_INFO_BLOCK, DATA_TYPES_KEYS,
} from './constants';
import * as DATA_TYPES from '../../Constants/dataTypes';

export default class Slider {
  constructor(parentElement, observer, cssClasses) {
    this.parentElement = parentElement;
    this.cssClass = cssClasses;
    this.dataTypeKey = -1;
    this.observer = observer;
    observer.subscribe(this);
    this.container = this.createContainer(this.parentElement);
  }

  start() {
    this.setHandlers();
  }

  update(state) {
    this.setDataType(state.dataType);
  }

  setDataType(dataType) {
    this.dataTypeKey = DATA_TYPES_KEYS.indexOf(dataType);
    this.mainInfoBlock.innerText = dataType;
  }

  createContainer(parentElem) {
    this.container = document.createElement('div');
    this.container.classList.add(this.cssClass);
    this.mainInfoBlock = document.createElement('div');
    this.mainInfoBlock.classList.add(`${this.cssClass}${MAIN_INFO_BLOCK}`, 'animate__animated');
    const leftArrow = document.createElement('div');
    leftArrow.classList.add(`${this.cssClass}${LEFT_ARROW}`, 'slider-btn', 'slider-left');
    const rightArrow = document.createElement('div');
    rightArrow.classList.add(`${this.cssClass}${RIGHT_ARROW}`, 'slider-btn', 'slider-right');
    this.container.append(leftArrow, this.mainInfoBlock, rightArrow);
    parentElem.append(this.container);
    return this.container;
  }

  setHandlers() {
    this.container.addEventListener('click', (e) => this.clickHandler(e));
  }

  clickHandler(e) {
    if (e.target.closest('.slider-left')) {
      this.changeInfo(-1, 'animate__fadeOutLeftBig', 'animate__fadeInRight');
    }
    if (e.target.closest('.slider-right')) {
      this.changeInfo(1, 'animate__fadeOutRightBig', 'animate__fadeInLeft');
    }
  }

  changeInfo(arrowNum, classNameRemoved, classNameAdded) {
    this.changeDataTypeKey(arrowNum);
    const dataType = DATA_TYPES[DATA_TYPES_KEYS[this.dataTypeKey]];
    this.mainInfoBlock.classList.add(classNameRemoved);
    setTimeout(() => {
      this.mainInfoBlock.classList = 'animate__animated';
      this.mainInfoBlock.classList.add(classNameAdded);
      this.mainInfoBlock.innerText = dataType;
    }, 100);
    this.observer.actions.setDataType(dataType);
  }

  changeDataTypeKey(num) {
    this.dataTypeKey += num;
    if (this.dataTypeKey < 0) this.dataTypeKey = 11;
    else if (this.dataTypeKey > 11) this.dataTypeKey = 0;
  }
}
