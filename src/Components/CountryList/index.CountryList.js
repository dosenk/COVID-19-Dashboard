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
} from './constants.CountryList';
import './styles.CountryList.scss';

export default class CountryList {
  constructor(parentElement, observer) {
    this.parentElem = parentElement;
    this.observer = observer;

    this.form = null;
    this.input = null;
    this.list = null;
  }

  searchHandler(event) {
    event.preventDefault();

    console.log(this.input.value);
  }

  listClickHandler({ target }) {
    const li = target.closest(`.${LI_CLASSNAME}`);

    if (!li) return;

    this.observer.actions.setCountry(li.dataset.name);
  }

  setHandlers() {
    this.form.addEventListener('submit', this.searchHandler.bind(this));
    this.list.addEventListener('click', this.listClickHandler.bind(this));
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

    this.form = document.createElement('form');
    this.form.classList.add(FORM_CLASSNAME);
    this.form.append(this.input);
    this.form.append(submitBtn);
    container.append(this.form);

    this.list = document.createElement('ul');
    this.list.classList.add(UL_CLASSNAME);
    container.append(this.list);

    this.setHandlers();
    this.parentElem.append(container);
  }

  createList(countriesMap, dataType) {
    const arr = Array.from(countriesMap.values());
    const fragment = new DocumentFragment();

    arr.sort((a, b) => b[dataType] - a[dataType]);

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
    if (state.loading) return;

    this.createList(state.data.Countries, state.dataType);
  }

  start() {
    this.observer.subscribe(this);
    this.createElements(this.parentElem);
  }
}
