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

  createSectionList() {
    const section = document.createElement('section');
    section.className = 'list-section';
    this.parent.appendChild(section);
    section.style.height = `${window.innerHeight * 0.6}px`;
    section.style.overflow = 'scroll';
    this.section = section;

    setTimeout(() => {
      this.fillList();
    }, 2000);
  }

  fillList() {
    this.addCheckbox();

    const divTextField = document.createElement('div');
    const textField = document.createElement('input');
    textField.type = 'textarea';
    textField.placeholder = 'Enter country';
    divTextField.appendChild(textField);

    const inputEnter = document.createElement('input');
    inputEnter.type = 'button';
    inputEnter.value = 'Search';
    inputEnter.addEventListener('click', () => {
      if (this.data.get(textField.value)) {
        this.getCountry(this.data.get(textField.value));
      } else if (textField.value === '') {
        this.fillContent();
      } else {
        textField.value = '';
        textField.placeholder = 'Re-enter country';
      }
    });
    divTextField.appendChild(inputEnter);

    this.section.appendChild(divTextField);

    const divTitles = document.createElement('table');
    this.divTitles = divTitles;
    this.section.appendChild(divTitles);
    this.createListTitles();

    const content = document.createElement('table');
    this.content = content;
    this.section.appendChild(content);

    this.fillContent();
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
