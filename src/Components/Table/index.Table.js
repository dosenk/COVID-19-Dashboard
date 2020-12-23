import * as types from '../../Constants/dataTypes';

export default class Table {
  constructor(parentElement, observer) {
    this.parent = parentElement;

    this.observer = observer;
    observer.subscribe(this);

    this.array = ['Flag', 'Name', 'Population', 'TotalConfirmed', 'TotalDeaths', 'TotalRecovered', 'NewConfirmed', 'NewDeaths', 'NewRecovered', 'By100kConfirmed', 'By100kDeaths', 'By100kRecovered', 'NewConfirmedBy100k', 'NewDeaths', 'NewDeathsBy100k'];
    this.arrayConfirmed = ['Flag', 'Name', 'Population', 'TotalConfirmed', 'NewConfirmed', 'By100kConfirmed', 'NewConfirmedBy100k'];
    this.arrayDeaths = ['Flag', 'Name', 'Population', 'TotalDeaths', 'NewDeaths', 'By100kDeaths', 'NewDeaths'];
    this.arrayRecovered = ['Flag', 'Name', 'Population', 'TotalRecovered', 'NewRecovered', 'By100kRecovered', 'NewDeathsBy100k'];
    this.arrayMenu = ['Recovered', 'Deaths', 'Confirmed'];
    this.arrayToggle = ['All', 'By100k'];
    this.indexMenu = 0;
    this.indexToggle = 0;

    this.createSectionTable();
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
    section.style.height = `${window.innerHeight * 0.6}px`;
    section.style.overflow = 'scroll';
    // section.style.maxWidth = `${window.innerWidth * 0.4}px`;
    this.section = section;
    setTimeout(() => {
      this.fillSection();
    }, 2000);
  }

  fillSection() {
    const divContent = document.createElement('div');
    this.content = divContent;

    const divMenu = document.createElement('div');
    const aLeft = document.createElement('a');
    const aCenter = document.createElement('a');
    const aRight = document.createElement('a');
    this.contentMenu = aCenter;

    const divToggle = document.createElement('div');
    const aLeftT = document.createElement('a');
    const aCenterT = document.createElement('a');
    const aRightT = document.createElement('a');
    this.contentToggle = aCenterT;

    aLeft.innerHTML = '&lt;';
    aLeft.addEventListener('click', () => {
      this.indexMenu = this.indexMenu === 0 ? 2 : this.indexMenu - 1;
      aCenter.innerHTML = `${this.arrayMenu[this.indexMenu]}`;
      this.fillTableContent();
    });
    divMenu.appendChild(aLeft);

    aCenter.innerHTML = `${this.arrayMenu[this.indexMenu]}`;
    divMenu.appendChild(aCenter);

    aRight.innerHTML = '&gt;';
    aRight.addEventListener('click', () => {
      this.indexMenu = this.indexMenu === 2 ? 0 : this.indexMenu + 1;
      aCenter.innerHTML = `${this.arrayMenu[this.indexMenu]}`;
      this.fillTableContent();
    });
    divMenu.appendChild(aRight);

    this.section.appendChild(divMenu);

    aLeftT.innerHTML = '&lt;';
    aLeftT.addEventListener('click', () => {
      this.indexToggle = this.indexToggle === 0 ? 1 : this.indexToggle - 1;
      aCenterT.innerHTML = `${this.arrayToggle[this.indexToggle]}`;
      this.fillTableContent();
    });
    divToggle.appendChild(aLeftT);

    aCenterT.innerHTML = `${this.arrayToggle[this.indexToggle]}`;
    divToggle.appendChild(aCenterT);

    aRightT.innerHTML = '&gt;';
    aRightT.addEventListener('click', () => {
      this.indexToggle = this.indexToggle === 1 ? 0 : this.indexToggle + 1;
      aCenterT.innerHTML = `${this.arrayToggle[this.indexToggle]}`;
      this.fillTableContent();
    });
    divToggle.appendChild(aRightT);

    this.section.appendChild(divToggle);
    this.section.appendChild(divContent);
    this.fillTableContent();
    this.fillInfoCountry('Belarus');
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
