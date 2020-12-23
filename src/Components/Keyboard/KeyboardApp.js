import Keyboard from './Keyboard';
import Key from './Key';
import './styles.css';

export default class KeyboardApp {
  constructor(input, submitHandler) {
    this.board = new Keyboard(this);
    this.board.area = input;
    this.submitHandler = submitHandler;

    this.capsIndicator = null;
    this.soundIndicator = null;
    this.speechIndicator = null;
    this.keyboard = null;
    this.soundBtn = null;
    this.speechBtn = null;
  }

  init(elemToAppend) {
    if (window.localStorage.getItem('lang')) {
      this.board.isEngLang = window.localStorage.getItem('lang') === 'eng';
    }

    this.generateElements(elemToAppend);
    this.setHandlers();
  }

  generateElements(elemToAppend) {
    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper';
    elemToAppend.append(wrapper);

    this.keyboard = document.createElement('div');
    this.keyboard.classList.add('keyboard');
    this.keyboard.id = 'keyboard';
    wrapper.append(this.keyboard);

    for (let i = 0; i < this.board.symbols.length; i += 1) {
      this.createKeysRow(this.board.symbols[i]);
    }

    this.createIndicators();
    this.board.initKeySets();
    this.board.initSpeechRecognition(this.speechIndicator);
  }

  setHandlers() {
    document.onkeydown = (e) => this.board.handleKeyDown(e);
    document.onkeyup = (e) => this.board.handleKeyUp(e);
  }

  createIndicators() {
    const capsBtn = document.querySelector('#CapsLock');
    this.capsIndicator = document.createElement('div');
    this.capsIndicator.classList.add('capslock--indicator');
    capsBtn.append(this.capsIndicator);

    this.soundBtn = document.querySelector('#sound');
    this.soundIndicator = document.createElement('div');
    this.soundIndicator.classList.add('sound--indicator');
    const label = document.createElement('label');
    this.soundBtn.textContent = '';
    this.soundBtn.append(this.soundIndicator);
    this.soundBtn.append(label);
    this.board.toggleSounds();

    this.speechBtn = document.querySelector('#speech');
    this.speechIndicator = document.createElement('div');
    this.speechIndicator.classList.add('speech--indicator');
    this.speechBtn.textContent = '🎤';
    this.speechBtn.append(this.speechIndicator);
  }

  createKeysRow(row) {
    const div = document.createElement('div');
    div.classList.add('key-row');
    this.keyboard.append(div);

    let fragment = new DocumentFragment();

    for (let i = 0; i < row.length; i += 1) {
      let key;

      if (this.board.isEngLang) {
        key = new Key(this.board, row[i][0][0], row[i][1]);
      } else {
        key = new Key(this.board, row[i][0][2], row[i][1]);
      }

      fragment = key.appendTo(fragment);
    }

    div.append(fragment);
  }
}
