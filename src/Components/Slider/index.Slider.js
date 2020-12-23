import { LEFT_ARROW, RIGHT_ARROW, MAIN_INFO_BLOCK } from './constants';
import { DATA_TYPES_VALUES, DATA_TYPES_DECRYPTION } from '../../Constants/index.Constants';

export default class Slider {
  constructor(observer) {
    this.observer = observer;
    if (observer !== null) observer.subscribe(this);
    this.createContainer();
  }

  start() {
    this.container.addEventListener('click', (e) => this.clickHandler(e));
  }

  update(state) {
    this.setDataType(state.dataType);
  }

  getContainer() {
    return this.container;
  }

  setDataType(dataType) {
    const dataTypeIndex = DATA_TYPES_VALUES.indexOf(dataType);
    this.infoBlock.innerText = DATA_TYPES_DECRYPTION[dataTypeIndex];
  }

  createContainer() {
    this.container = document.createElement('div');
    this.container.classList.add('slider');
    this.infoBlock = document.createElement('div');
    this.infoBlock.classList.add(`${MAIN_INFO_BLOCK}`, 'animate__animated');
    const leftArrow = document.createElement('div');
    leftArrow.classList.add(`${LEFT_ARROW}`, 'slider-btn', 'slider-left');
    const rightArrow = document.createElement('div');
    rightArrow.classList.add(`${RIGHT_ARROW}`, 'slider-btn', 'slider-right');
    this.container.append(leftArrow, this.infoBlock, rightArrow);
  }

  clickHandler(e) {
    if (e.target.closest('.slider-left')) {
      this.changeInfo(-1);
    }
    if (e.target.closest('.slider-right')) {
      this.changeInfo(1);
    }
  }

  changeInfo(offset) {
    const oldDataTypeIndex = DATA_TYPES_DECRYPTION.indexOf(this.infoBlock.innerText);
    const newDataTypeIndex = Slider.changeDataTypeKey(oldDataTypeIndex + offset);
    const newDataType = DATA_TYPES_VALUES[newDataTypeIndex];
    const newDataTypeText = DATA_TYPES_DECRYPTION[newDataTypeIndex];
    this.infoBlock.innerText = newDataTypeText;
    this.observer.actions.setDataType(newDataType);
  }

  static changeDataTypeKey(num) {
    const lengthTypeKeys = DATA_TYPES_VALUES.length - 1;
    if (num < 0) return lengthTypeKeys;
    if (num > lengthTypeKeys) return 0;
    return num;
  }
}
