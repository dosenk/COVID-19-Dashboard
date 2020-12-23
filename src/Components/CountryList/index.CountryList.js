import { COUNTRY } from '../../Observer/actionTypes';
import KeyboardApp from '../Keyboard/KeyboardApp';
import Slider from '../Slider/index.Slider';
import {
  CONTAINER_CLASSNAME,
  SEARCH_CLASSNAME,
  SEARCH_PLACEHOLDER,
  FORM_CLASSNAME,
  SUBMIT_CLASSNAME,
  SUBMIT_LABEL,
  UL_CLASSNAME,
  LI_CLASSNAME,
  ICO_CLASSNAME,
  ICO_HIDDEN_CLASSNAME,
  COUNTER_CLASSNAME,
  CLEAR_CLASSNAME,
  KEYBOARD_CLASSNAME,
  KB_CONTAINER_CLASSNAME,
  KB_HIDDEN_CLASSNAME,
  FLAG_CLASSNAME,
  COUNTRY_CLASSNAME,
  CLEAR_LABEL,
  CLEAR_TITLE,
} from './constants.CountryList';
import './styles.CountryList.scss';

export default class CountryList {
  constructor(parentElement, observer) {
    this.parentElem = parentElement;
    this.observer = observer;

    this.form = null;
    this.input = null;
    this.list = null;
    this.clearBtn = null;
    this.keyboardBtn = null;
    this.keyboardContainer = null;
    this.keyboard = null;
    this.countriesArr = [];
    this.slider = new Slider(observer);
  }

  inputHandler() {
    this.createList(this.observer.state.dataType);
  }

  clearHandler(event) {
    event.preventDefault();

    this.input.value = '';
    this.inputHandler();
  }

  submitHandler(event) {
    if (event) event.preventDefault();

    if (this.list.children.length !== 1) return;

    const country = this.list.children[0].dataset.name;

    this.observer.actions.setCountry(country);
  }

  listClickHandler({ target }) {
    const li = target.closest(`.${LI_CLASSNAME}`);

    if (!li) return;

    this.observer.actions.setCountry(li.dataset.name);
  }

  toggleKeyboard() {
    this.keyboardContainer.classList.toggle(KB_HIDDEN_CLASSNAME);
  }

  setHandlers() {
    this.form.addEventListener('input', this.inputHandler.bind(this));
    this.form.addEventListener('submit', this.submitHandler.bind(this));
    this.list.addEventListener('click', this.listClickHandler.bind(this));
    this.clearBtn.addEventListener('click', this.clearHandler.bind(this));
    this.keyboardBtn.addEventListener('click', this.toggleKeyboard.bind(this));
  }

  addKeyboard(container) {
    this.keyboardContainer = document.createElement('div');
    this.keyboardContainer.classList.add(
      KB_CONTAINER_CLASSNAME,
      KB_HIDDEN_CLASSNAME,
    );
    container.append(this.keyboardContainer);
  }

  addForm(container, submitBtn) {
    this.form = document.createElement('form');
    this.form.classList.add(FORM_CLASSNAME);
    this.form.append(this.keyboardBtn);
    this.form.append(this.input);
    this.form.append(this.clearBtn);
    this.form.append(submitBtn);
    container.append(this.form);
  }

  createElements() {
    const container = document.createElement('div');
    container.classList.add(CONTAINER_CLASSNAME);

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = SEARCH_PLACEHOLDER;
    this.input.classList.add(SEARCH_CLASSNAME);

    const submitBtn = document.createElement('button');
    submitBtn.classList.add(SUBMIT_CLASSNAME);
    submitBtn.textContent = SUBMIT_LABEL;

    this.clearBtn = document.createElement('button');
    this.clearBtn.classList.add(CLEAR_CLASSNAME);
    this.clearBtn.textContent = CLEAR_LABEL;
    this.clearBtn.title = CLEAR_TITLE;

    this.keyboardBtn = document.createElement('button');
    this.keyboardBtn.classList.add(KEYBOARD_CLASSNAME);
    this.keyboardBtn.textContent = 'Keyboard';

    this.addForm(container, submitBtn);
    this.addKeyboard(container);

    this.list = document.createElement('ul');
    this.list.classList.add(UL_CLASSNAME);
    container.append(this.list);

    container.append(this.slider.getContainer());

    this.setHandlers();
    this.parentElem.append(container);
  }

  static addFlag(data) {
    const img = document.createElement('img');

    img.classList.add(ICO_CLASSNAME, ICO_HIDDEN_CLASSNAME);
    img.src = data.flag;
    img.alt = data.alpha2Code;
    img.addEventListener('load', () => {
      img.classList.remove(ICO_HIDDEN_CLASSNAME);
    });

    const container = document.createElement('div');

    container.classList.add(FLAG_CLASSNAME);
    container.append(img);

    return container;
  }

  createList(dataType) {
    const fragment = new DocumentFragment();
    const value = this.input.value.trim().toLowerCase();
    let arr = this.countriesArr;

    if (value) {
      arr = arr.filter((item) => {
        const country = item.name.toLowerCase();

        return country.includes(value);
      });
    }

    arr.forEach((item) => {
      const img = CountryList.addFlag(item);
      const name = document.createElement('span');
      name.classList.add(COUNTRY_CLASSNAME);
      name.textContent = item.name;

      const dataProp = document.createElement('span');
      dataProp.classList.add(COUNTER_CLASSNAME);
      dataProp.textContent = item[dataType];

      const li = document.createElement('li');
      li.classList.add(LI_CLASSNAME);
      li.dataset.name = item.name;
      li.append(img);
      li.append(name);
      li.append(dataProp);

      fragment.append(li);
    });

    this.list.textContent = '';
    this.list.append(fragment);
  }

  update(state, actionType) {
    if (actionType === COUNTRY) return;

    const { dataType, data, loading } = state;

    if (loading) return;

    this.countriesArr = Array.from(data.Countries.values());

    this.countriesArr.sort((a, b) => b[dataType] - a[dataType]);
    this.createList(dataType);
  }

  start() {
    this.observer.subscribe(this);
    this.createElements(this.parentElem);

    this.keyboard = new KeyboardApp(this.input, this.submitHandler.bind(this));
    this.keyboard.init(this.keyboardContainer);

    this.slider.start();
  }
}
