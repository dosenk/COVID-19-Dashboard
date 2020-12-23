import playKeySound from './playKeySound';

export default class Key {
  constructor(keyboardInst, value, keyCode) {
    this.keyboardInst = keyboardInst;
    this.value = value;
    this.keyCode = keyCode;
    this.area = keyboardInst.area;
    // in ru_lang they are letters, but in en_lang - symbols
    this.mixedKeys = [
      'Backquote',
      'BracketLeft',
      'BracketRight',
      'Semicolon',
      'Quote',
      'Comma',
      'Period',
      'lang',
    ];
  }

  setButtonType(button) {
    if (this.keyCode.includes('Key')) {
      button.classList.add('letter');
    } else if (this.mixedKeys.includes(this.keyCode)) {
      button.classList.add('mixed');
    } else {
      button.classList.add('symbol');
    }

    button.append(this.value);
  }

  appendTo(fragment) {
    const button = document.createElement('button');
    button.classList.add('keyboard--button');

    if (this.value) {
      this.setButtonType(button);
    } else {
      button.classList.add('functional');
      button.classList.add(this.keyCode.toLowerCase());
      button.append(this.keyCode);
    }

    button.addEventListener('mousedown', (e) => this.keyDown(e));
    button.addEventListener('mouseup', () => this.keyUp());
    button.addEventListener('mouseout', () => this.keyUp());
    button.id = this.keyCode;
    fragment.append(button);
    return fragment;
  }

  moveCursorLeft(ShiftLeft) {
    if (
      !ShiftLeft.classList.contains('button_active')
      && this.area.selectionStart === 0
    ) {
      this.area.setSelectionRange(
        this.area.selectionStart,
        this.area.selectionStart,
      );
    } else if (!ShiftLeft.classList.contains('button_active')) {
      this.area.setSelectionRange(
        this.area.selectionStart - 1,
        this.area.selectionStart - 1,
      );
    } else if (
      this.area.selectionStart !== this.area.selectionEnd
      && this.area.selectionDirection === 'forward'
    ) {
      this.area.setSelectionRange(
        this.area.selectionStart,
        this.area.selectionEnd - 1,
        'forward',
      );
    } else if (this.area.selectionStart > 0) {
      this.area.setSelectionRange(
        this.area.selectionStart - 1,
        this.area.selectionEnd,
        'backward',
      );
    }
  }

  moveCursorRight(ShiftLeft) {
    if (
      !ShiftLeft.classList.contains('button_active')
      && this.area.value.length === this.area.selectionEnd
    ) {
      this.area.setSelectionRange(
        this.area.selectionEnd,
        this.area.selectionEnd,
      );
    } else if (!ShiftLeft.classList.contains('button_active')) {
      this.area.setSelectionRange(
        this.area.selectionEnd + 1,
        this.area.selectionEnd + 1,
      );
    } else if (
      this.area.selectionStart === this.area.selectionEnd
      || this.area.selectionDirection === 'forward'
    ) {
      this.area.setSelectionRange(
        this.area.selectionStart,
        this.area.selectionEnd + 1,
        'forward',
      );
    } else {
      this.area.setSelectionRange(
        this.area.selectionStart + 1,
        this.area.selectionEnd,
        'backward',
      );
    }
  }

  repeatKey(fn, keyValue) {
    const keyRepeatInterval = 175;

    fn(keyValue);
    this.interval = setInterval(fn, keyRepeatInterval, keyValue);
  }

  keyDown(event) {
    const ShiftLeft = document.getElementById('ShiftLeft');
    const ShiftRight = document.getElementById('ShiftRight');
    const AltLeft = document.getElementById('AltLeft');

    const keyId = event.target.id;

    switch (keyId) {
      case 'Backspace':
        this.repeatKey(() => {
          this.keyboardInst.backspace();
        });
        break;
      case 'Space':
        this.keyboardInst.printText(' ');
        break;
      case 'Tab':
        this.repeatKey(() => {
          this.keyboardInst.printText('    ');
        });
        break;
      case 'Enter':
        this.keyboardInst.keyboardAppInst.submitHandler();
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        ShiftLeft.classList.toggle('button_active');
        ShiftRight.classList.toggle('button_active');

        if (AltLeft.classList.contains('button_active')) {
          ShiftLeft.classList.remove('button_active');
          ShiftRight.classList.remove('button_active');
          AltLeft.classList.remove('button_active');
          this.keyboardInst.changeLang();
        } else {
          this.keyboardInst.toggleCase();
          this.keyboardInst.shiftSymbols();
        }
        break;
      case 'CapsLock':
        this.keyboardInst.toggleCase();
        this.keyboardInst.toggleCapsIndicator();
        break;
      case 'AltLeft':
      case 'AltRight':
        AltLeft.classList.toggle('button_active');

        if (ShiftLeft.classList.contains('button_active')) {
          ShiftLeft.classList.remove('button_active');
          ShiftRight.classList.remove('button_active');
          AltLeft.classList.remove('button_active');
          this.keyboardInst.changeLang();
        }
        break;
      case 'ArrowLeft':
        this.repeatKey(() => {
          this.moveCursorLeft(ShiftLeft);
        });
        break;
      case 'ArrowRight':
        this.repeatKey(() => {
          this.moveCursorRight(ShiftLeft);
        });
        break;
      case 'lang':
        this.keyboardInst.changeLang();
        break;
      case 'sound':
        this.keyboardInst.toggleSounds();
        break;
      case 'speech':
        this.keyboardInst.speech.toggleState();
        break;
      default:
        this.repeatKey((text) => {
          this.keyboardInst.printText(text);
        }, event.target.textContent);
        break;
    }

    playKeySound(
      keyId,
      this.keyboardInst.isEngLang,
      this.keyboardInst.isSoundOn,
    );

    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true,
    });

    this.area.dispatchEvent(inputEvent);
  }

  keyUp() {
    clearInterval(this.interval);
    this.area.focus();
  }
}
