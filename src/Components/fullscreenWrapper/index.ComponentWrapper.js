import { BLOCK_CLASSNAME, REMOVED_CLASSNAME } from '../../Constants/classNames';
import {
  WRAPPER_CLASS_NAME,
  FULLSCREEN_BTN_ENTER,
  FULLSCREEN_BTN_EXIT,
  FULLSCREEN_CLASS_NAME,
} from './constants';
import './styles.scss';

const fullscreen = (e) => {
  const btn = e.target;
  const wrapper = btn.parentElement;
  const components = document.querySelectorAll(`.${WRAPPER_CLASS_NAME}`);
  const mainEl = document.querySelector('main');

  components.forEach((component) => {
    component.classList.toggle(REMOVED_CLASSNAME);
  });

  mainEl.classList.toggle(BLOCK_CLASSNAME);
  btn.classList.toggle(FULLSCREEN_BTN_EXIT);
  btn.classList.toggle(FULLSCREEN_BTN_ENTER);
  wrapper.classList.toggle(FULLSCREEN_CLASS_NAME);
};

export default (parentElem, componentClassName) => {
  const wrapper = document.createElement('div');
  wrapper.classList.add(componentClassName, WRAPPER_CLASS_NAME);

  const fullScreenBtn = document.createElement('button');
  fullScreenBtn.classList.add(FULLSCREEN_BTN_ENTER);
  fullScreenBtn.addEventListener('click', fullscreen);
  wrapper.append(fullScreenBtn);

  parentElem.append(wrapper);

  return wrapper;
};
