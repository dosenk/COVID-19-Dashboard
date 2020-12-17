// можно указывать без периода - тогда выдаст данные за весь период
// const allCovidInfo = await this.fetcher.getCovidInfoAll();
// const allCovidInfoByPeriod = await this.fetcher.getCovidInfoByCountryPeriod('Belarus', '2020-12-02');
// console.log(allCovidInfoByPeriod);
//  'NewDeaths', 'NewConfirmed', 'NewRecovered', 'TotalDeaths', 'TotalConfirmed', 'TotalRecovered'
// New - last day, Total - all time, 'ALL' - all world, 'Afghanistan' - country
// console.log(await this.fetcher.getOptionsCovidInfo(allCovidInfo, 'NewConfirmed'));
// console.log(await this.fetcher.getOptionsCovidInfo(allCovidInfo, 'NewRecovered', 'Russian Federation'));
// console.log(await this.fetcher.getOptionsCovidInfo(allCovidInfo, 'NewDeaths', 'ALL'));
// console.log(await this.fetcher.getOptionsCovidInfo(allCovidInfo, 'TotalConfirmed', 'Belarus'));
// console.log(await this.fetcher.getOptionsCovidInfo(allCovidInfo, 'TotalRecovered', 'Afghanistan'));
// console.log(await this.fetcher.getOptionsCovidInfo(allCovidInfo, 'TotalDeaths', 'Afghanistan'));

// const ALLPOPULATION = 7827000000;
// import DATA_POPULATION from '../assets/data/allCountriesPopulation.json';
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

  async getCountriesInfo() {
    const data = await Fetcher.getData(
      `${this.countryInfoApiPath}/all?fields=name;population;flag;alpha2Code;latlng`,
    );

    return JSON.parse(data);
  }

  async getCovidInfoAll() {
    const data = await Fetcher.getData(`${this.covidApiPath}/summary`);
    const recivedData = JSON.parse(data);
    return recivedData.Message !== '' ? DATA_COVID : recivedData;
  }

  async getCovidInfoByCountryPeriod(country, startD = null, endD = null) {
    const startDate = startD === null ? '2019-11-17' : startD;
    const endDate = endD === null
      ? `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()}`
      : endD;
    const url = `/country/${country}?from=${startDate}T00:00:00Z&to=${endDate}T00:00:00Z`;
    const recivedData = await Fetcher.getData(this.covidApiPath + url);
    const data = JSON.parse(recivedData);
    return { country, period: { startDate, endDate }, data };
  }

  async getOptionsCovidInfo(data, info, country = 'ALL') {
    try {
      const countriesInfoCovid = country !== 'ALL'
        ? data.Countries.filter(
          (countryObg) => countryObg.Country === country,
        )[0]
        : data.Global;
      const result = { country };
      if (countriesInfoCovid[info] === undefined) {
        throw new Error(`Cannot read property ${info} of undefined"`);
      }
      result[`${info[0].toLowerCase()}${info.slice(1)}`] = countriesInfoCovid[info];
      if (country !== 'ALL') {
        const countryInfo = await this.getCountryInfo(country);
        result.by100Thousand = (100000 * countriesInfoCovid[info]) / countryInfo.population;
      }
      return result;
    } catch (error) {
      return { country: 'notFound', error: error.message };
    }
  }
}
