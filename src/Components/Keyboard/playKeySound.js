import './sounds/tom.wav';
import './sounds/boom.wav';
import './sounds/clap.wav';
import './sounds/openhat.wav';
import './sounds/kick.wav';
import './sounds/hihat.wav';

export default (id, isEngLang, isSoundOn) => {
  if (!isSoundOn) return;

  let src = './tom.wav';

  if (isEngLang) src = './boom.wav';

  switch (id) {
    case 'ShiftLeft':
    case 'ShiftRight':
      src = './clap.wav';
      break;
    case 'CapsLock':
      src = './openhat.wav';
      break;
    case 'Backspace':
      src = './kick.wav';
      break;
    case 'Enter':
      src = './hihat.wav';
      break;
    default:
      break;
  }

  const audio = new Audio(src);
  audio.play();
};
