import * as types from '../../Constants/dataTypes';

export default class Table {
  constructor(parentElement, observer) {
    this.parent = parentElement;

    this.observer = observer;
    observer.subscribe(this);

    this.array = ['Flag', 'Country', 'Population', 'TotalConfirmed', 'TotalDeaths', 'TotalRecovered', 'NewConfirmed', 'NewDeaths', 'NewRecovered', 'By100kConfirmed', 'By100kDeaths', 'By100kRecovered', 'NewConfirmedBy100k', 'NewDeaths', 'NewDeathsBy100k'];
    this.arrayConfirmed = ['Flag', 'Country', 'Population', 'TotalConfirmed', 'NewConfirmed', 'By100kConfirmed', 'NewConfirmedBy100k'];
    this.arrayDeaths = ['Flag', 'Country', 'Population', 'TotalDeaths', 'NewDeaths', 'By100kDeaths', 'NewDeaths'];
    this.arrayRecovered = ['Flag', 'Country', 'Population', 'TotalRecovered', 'NewRecovered', 'By100kRecovered', 'NewDeathsBy100k'];
  }

  update(state, eventType) {
    if (eventType === 'DATA_FETCHED') {
      this.data = state.data.Countries;
      this.countries = Array.from(state.data.Countries).map((el) => el[el.length - 1]);
      this.global = state.data.Global.slice(0, 1);

      console.log(this.global);
      console.log(this.data);
      console.log(this.countries);
    }
  }

  createSectionTable() {
    const section = document.createElement('section');
    section.className = 'list-section';
    this.parent.appendChild(section);
    // section.style.height = `${window.innerHeight * 0.9}px`;
    // section.style.maxWidth = `${window.innerWidth * 0.4}px`;
    this.section = section;
  }

  addChangeTypeBtn(type) {
    const btn = document.createElement('button');
    btn.textContent = type;

    btn.addEventListener('click', (event) => {
      this.observer.actions.setDataType(event.currentTarget.textContent);
    });

    this.div.append(btn);
  }

  start() {
    this.div = document.createElement('div');
    const input = document.createElement('input');

    input.type = 'text';
    input.addEventListener('change', (event) => {
      this.observer.actions.setCountry(event.currentTarget.value);
    });
    this.div.append(input);

    Object.values(types).forEach((type) => {
      this.addChangeTypeBtn(type);
    });

    this.parent.append(this.div);
  }
}
