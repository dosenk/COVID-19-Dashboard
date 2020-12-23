export default class List {
  constructor(parentElement, observer) {
    this.parent = parentElement;
    this.observer = observer;
    observer.subscribe(this);
    this.array = ['Flag', 'Name', 'Population', 'TotalConfirmed', 'TotalDeaths', 'TotalRecovered', 'NewConfirmed', 'NewDeaths', 'NewRecovered', 'By100kConfirmed', 'By100kDeaths', 'By100kRecovered', 'NewConfirmedBy100k', 'NewDeaths', 'NewDeathsBy100k'];
    this.dataArr = [];
    this.createSectionList();
  }

  update(state, eventType) {
    if (eventType === 'DATA_FETCHED') {
      this.data = state.data.Countries;
      this.countries = Array.from(state.data.Countries).map((el) => el[el.length - 1]);
      console.log(state.data);
    }
  }

  start() {
    this.div = document.createElement('div');
    const input = document.createElement('input');

    input.type = 'text';
    input.addEventListener('change', (event) => {
      this.observer.actions.setCountry(event.currentTarget.value);
    });
    this.div.append(input);

    this.parent.append(this.div);
  }
}
