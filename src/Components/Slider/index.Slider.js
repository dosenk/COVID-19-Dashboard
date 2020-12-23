import { LEFT_ARROW, RIGHT_ARROW, MAIN_INFO_BLOCK } from './constants';
import { DATA_TYPES_VALUES, DATA_TYPES_DECRYPTION } from '../../Constants/index.Constants';

export default class Slider {
  constructor(observer, tableFlag = false) {
    this.observer = observer;
    this.tableFlag = tableFlag;
    observer.subscribe(this);
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
    let data;
    if (this.tableFlag) {
      const dataTypeIndex = DATA_TYPES_VALUES.indexOf(dataType);
      this.tableDataTypeCLOSE = DATA_TYPES_DECRYPTION[dataTypeIndex];
      data = dataType.indexOf('100') >= 0 ? 'All Cases / 100 th' : 'All Cases';
    } else {
      const dataTypeIndex = DATA_TYPES_VALUES.indexOf(dataType);
      data = DATA_TYPES_DECRYPTION[dataTypeIndex];
    }
    this.infoBlock.innerText = data;
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
    let offsetNum = offset;
    let oldDataType = this.infoBlock.innerText;
    if (this.tableFlag) {
      offsetNum = 0;
      oldDataType = (this.infoBlock.innerText.indexOf('100')) >= 0
        ? this.tableDataTypeCLOSE.slice(0, this.tableDataTypeCLOSE.indexOf('/'))
        : this.tableDataTypeCLOSE.concat(' / 100 th');
    }
    const oldDataTypeIndex = DATA_TYPES_DECRYPTION.indexOf(oldDataType.trim());
    const newDataTypeIndex = Slider.changeDataTypeKey(oldDataTypeIndex + offsetNum);
    const newDataType = DATA_TYPES_VALUES[newDataTypeIndex];
    this.newDataTypeText = DATA_TYPES_DECRYPTION[newDataTypeIndex];
    this.infoBlock.innerText = this.newDataTypeText;
    this.observer.actions.setDataType(newDataType);
  }

  static changeDataTypeKey(num) {
    const lengthTypeKeys = DATA_TYPES_VALUES.length - 1;
    if (num < 0) return lengthTypeKeys;
    if (num > lengthTypeKeys) return 0;
    return num;
  }
}
