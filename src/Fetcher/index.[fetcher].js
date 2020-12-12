// const ALLPOPULATION = 7827000000;
import DATA_POPULATION from '../assets/data/allCountriesPopulation.json';
import DATA_COVID from '../assets/data/allCovidInfo.json';

export default class Fetcher {
  constructor(covidApiPath, countryInfoApiPath) {
    this.covidApiPath = covidApiPath;
    this.countryInfoApiPath = countryInfoApiPath;
  }

  static async getData(path) {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    const result = await fetch(path, requestOptions)
      .then((response) => response.text())
      .catch((error) => error);
    return result;
  }

  async getCountriesPopulation(country) {
    try {
      return await Promise.race([
        new Promise((res) => {
          res(Fetcher.getData(this.countryInfoApiPath));
        }),
        new Promise((res) => {
          setTimeout(() => {
            res(DATA_POPULATION);
          }, 2000);
        }),
      ]).then((data) => JSON.parse(data)
        .filter((countryObg) => countryObg.name === country)[0].population);
    } catch (error) {
      return 0;
    }
  }

  async getAllCovidInfo() {
    const result = await Promise.race([
      new Promise((res) => {
        res(Fetcher.getData(this.covidApiPath));
      }),
      new Promise((res) => {
        setTimeout(() => {
          res(DATA_COVID);
        }, 2000);
      }),
    ]).then((data) => JSON.parse(data));
    return result;
  }

  async getOptionsCovidInfo(data, info, country = 'ALL') {
    try {
      const countriesInfoCovid = (country !== 'ALL')
        ? data.Countries
          .filter((countryObg) => countryObg.Slug === country)[0]
        : data.Global;
      const countriesPopulation = await this.getCountriesPopulation(country);
      const result = { country };
      if (countriesInfoCovid[info] === undefined) throw new Error(`Cannot read property ${info} of undefined"`);
      result[`${info[0].toLowerCase()}${info.slice(1)}`] = countriesInfoCovid[info];
      result[`${info[0].toLowerCase()}${info.slice(1)}By100Th`] = countriesPopulation !== 0
        ? (100000 * countriesInfoCovid[info]) / countriesPopulation
        : '';
      return result;
    } catch (error) {
      return { country: 'notFound', error: error.message };
    }
  }
}
