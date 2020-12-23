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
    this.countriesArr = [];
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
    event.preventDefault();

    if (this.list.children.length !== 1) return;

    const country = this.list.children[0].dataset.name;

    this.observer.actions.setCountry(country);
  }

  listClickHandler({ target }) {
    const li = target.closest(`.${LI_CLASSNAME}`);

    if (!li) return;

    this.observer.actions.setCountry(li.dataset.name);
  }

  setHandlers() {
    this.form.addEventListener('input', this.inputHandler.bind(this));
    this.form.addEventListener('submit', this.submitHandler.bind(this));
    this.list.addEventListener('click', this.listClickHandler.bind(this));
    this.clearBtn.addEventListener('click', this.clearHandler.bind(this));
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
    this.clearBtn.textContent = 'X';

    const keyboardBtn = document.createElement('button');
    keyboardBtn.classList.add(KEYBOARD_CLASSNAME);
    keyboardBtn.textContent = 'Keyboard';

    this.form = document.createElement('form');
    this.form.classList.add(FORM_CLASSNAME);
    this.form.append(keyboardBtn);
    this.form.append(this.input);
    this.form.append(this.clearBtn);
    this.form.append(submitBtn);
    container.append(this.form);

    this.list = document.createElement('ul');
    this.list.classList.add(UL_CLASSNAME);
    container.append(this.list);

    this.setHandlers();
    this.parentElem.append(container);
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
      const img = document.createElement('img');
      img.classList.add(ICO_CLASSNAME, ICO_HIDDEN_CLASSNAME);
      img.src = item.flag;
      img.alt = item.alpha2Code;
      img.addEventListener('load', () => {
        img.classList.remove(ICO_HIDDEN_CLASSNAME);
      });

      const name = document.createElement('span');
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

  update(state) {
    const { dataType, data, loading } = state;

    if (loading) return;

    this.countriesArr = Array.from(data.Countries.values());

    this.countriesArr.sort((a, b) => b[dataType] - a[dataType]);
    this.createList(dataType);
  }

  start() {
    this.observer.subscribe(this);
    this.createElements(this.parentElem);
  }
}
