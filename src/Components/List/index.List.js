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

  getCountry(countryObj) {
    while (this.content.firstChild) {
      this.content.removeChild(this.content.firstChild);
    }
    const ul = document.createElement('tr');
    ul.style.display = 'flex';
    this.array.forEach((keyName, keyIndex) => {
      const checkbox = document.querySelector(`.checkbox${keyName}`);
      if (checkbox.checked) {
        const li = document.createElement('td');
        li.className = `title-${keyName}`;
        if (!keyIndex) {
          li.style.backgroundImage = `url('${countryObj[keyName.replace('F', 'f')]}')`;
        } else {
          li.innerHTML = `${countryObj[keyName.replace('Name', 'name').replace('P', 'p')]} `;
        }
        ul.appendChild(li);
      }
    });
    this.content.appendChild(ul);
  }

  fillContent() {
    this.createListTitles();
    while (this.content.firstChild) {
      this.content.removeChild(this.content.firstChild);
    }

    this.countries.forEach((country) => {
      const ul = document.createElement('tr');
      ul.className = `${country.Slug}-list`;
      ul.style.display = 'flex';
      this.array.forEach((keyName, keyIndex) => {
        const checkbox = document.querySelector(`.checkbox${keyName}`);
        if (checkbox.checked) {
          const li = document.createElement('td');
          li.className = `title-${keyName}`;
          if (!keyIndex) {
            li.style.backgroundImage = `url('${country[keyName.replace('F', 'f')]}')`;
          } else {
            li.innerHTML = `${country[keyName.replace('Name', 'name').replace('P', 'p')]} `;
          }
          ul.appendChild(li);
        }
      });
      this.content.appendChild(ul);
    });
  }

  addCheckbox() {
    const div = document.createElement('table');
    div.className = 'checkbox-list';
    div.style.display = 'flex';
    this.array.forEach((el, index) => {
      const label = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.className = `checkbox${el}`;
      label.innerText += el;
      input.checked = true;
      input.addEventListener('click', () => {
        this.fillContent();
      });
      label.appendChild(input);
      div.appendChild(label);
    });
    this.section.appendChild(div);
  }

  createListTitles() {
    while (this.divTitles.firstChild) {
      this.divTitles.removeChild(this.divTitles.firstChild);
    }
    const ul = document.createElement('tr');
    ul.style.display = 'flex';
    this.array.forEach((keyName, keyIndex) => {
      if (document.querySelector(`.checkbox${keyName}`).checked) {
        const li = document.createElement('td');
        const a = document.createElement('a');
        const aUp = document.createElement('a');
        const aDown = document.createElement('a');
        li.className = `title-${keyName}`;
        a.innerHTML = `${keyName.replace('Name', 'Country')}`; // &uArr; &dArr;
        if (keyIndex) {
          aUp.innerHTML = '&uArr;'; // &uArr; &dArr;
          aDown.innerHTML = '&dArr;'; // &uArr; &dArr;
        }
        if (keyIndex) {
          li.addEventListener('click', (e) => {
            if (e.target.innerHTML === '⇑') {
              this.countries = this.countries.sort((a1, b) => {
                if (a1[keyName.replace('Name', 'name').replace('P', 'p')] > b[keyName.replace('Name', 'name').replace('P', 'p')]) {
                  return 1;
                }
                if (a1[keyName.replace('Name', 'name').replace('P', 'p')] < b[keyName.replace('Name', 'name').replace('P', 'p')]) {
                  return -1;
                }
                return 0;
              });
            } else if (e.target.innerHTML === '⇓') {
              this.countries = this.countries.sort((a1, b) => {
                if (a1[keyName.replace('Name', 'name').replace('P', 'p')] > b[keyName.replace('Name', 'name').replace('P', 'p')]) {
                  return -1;
                }
                if (a1[keyName.replace('Name', 'name').replace('P', 'p')] < b[keyName.replace('Name', 'name').replace('P', 'p')]) {
                  return 1;
                }
                return 0;
              });
            }
            this.fillContent();
          });
        }
        li.appendChild(a);
        li.appendChild(aUp);
        li.appendChild(aDown);
        ul.appendChild(li);
      }
    });
    this.divTitles.appendChild(ul);
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
