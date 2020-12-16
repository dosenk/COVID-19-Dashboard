import { LOADING, DATA_FETCHED, COUNTRY, DATA_TYPE } from './actionTypes';
import Fetcher from '../Fetcher/index.Fetcher';
import {
  COVID_API,
  COUNTRY_INFO_API,
  DEFAULT_PRECISION,
} from '../Constants/index.Constants';
import {
  BY_100K_CONFIRMED,
  BY_100K_DEATHS,
  BY_100K_RECOVERED,
  NEW_DEATHS_BY_100K,
  NEW_RECOVERED_BY_100K,
  NEW_CONFIRMED_BY_100K,
  TOTAL_CONFIRMED,
  TOTAL_DEATHS,
  TOTAL_RECOVERED,
  NEW_DEATHS,
  NEW_RECOVERED,
  NEW_CONFIRMED,
} from '../Constants/dataTypes';

export default class ActionCreator {
  constructor(observer) {
    this.observer = observer;
    this.fetcher = new Fetcher(`${COVID_API}`, COUNTRY_INFO_API);
  }

  setLoading(isLoading = true) {
    if (this.observer.getState().loading === isLoading) return;

    this.observer.dispatch({
      type: LOADING,
      payload: isLoading,
    });
  }

  static addType(dataItem, type) {
    const hundredK = dataItem.population / 100000;
    const result = dataItem[type] / hundredK;

    return Number(result.toFixed(DEFAULT_PRECISION));
  }

  static getRelativeDataObj(dataItem) {
    return {
      [BY_100K_CONFIRMED]: ActionCreator.addType(dataItem, TOTAL_CONFIRMED),
      [BY_100K_DEATHS]: ActionCreator.addType(dataItem, TOTAL_DEATHS),
      [BY_100K_RECOVERED]: ActionCreator.addType(dataItem, TOTAL_RECOVERED),
      [NEW_CONFIRMED_BY_100K]: ActionCreator.addType(dataItem, NEW_CONFIRMED),
      [NEW_DEATHS_BY_100K]: ActionCreator.addType(dataItem, NEW_DEATHS),
      [NEW_RECOVERED_BY_100K]: ActionCreator.addType(dataItem, NEW_RECOVERED),
    };
  }

  static addRelativeTypesData(covidData) {
    let worldPopulation = 0;

    const Countries = covidData.Countries.map((dataItem) => {
      worldPopulation += dataItem.population;

      return {
        ...dataItem,
        ...ActionCreator.getRelativeDataObj(dataItem),
      };
    });

    const globalWithPopulation = {
      ...covidData.Global,
      population: worldPopulation,
    };
    const Global = {
      ...globalWithPopulation,
      ...ActionCreator.getRelativeDataObj(globalWithPopulation),
    };

    return {
      Countries,
      Global,
    };
  }

  static mergeData(covidData, countriesData) {
    if (!covidData.Countries.length || !countriesData.length) {
      throw new Error("Can't find required properties in fetched data");
    }

    const Countries = covidData.Countries.map((covidDataObj) => {
      const countryCode = covidDataObj.CountryCode;
      const countryObj = countriesData.find(
        (countiesDataItem) => countiesDataItem.alpha2Code === countryCode,
      );

      if (!countryObj) return covidDataObj;

      return {
        ...covidDataObj,
        flag: countryObj.flag,
        population: countryObj.population,
      };
    });

    return {
      ...covidData,
      Countries,
    };
  }

  async fetchApiData() {
    this.setLoading(true);

    try {
      const covidData = await this.fetcher.getCovidInfoAll();
      const countriesData = await this.fetcher.getCountriesInfo();
      const merged = ActionCreator.mergeData(covidData, countriesData);
      const data = ActionCreator.addRelativeTypesData(merged);

      this.observer.dispatch({
        type: DATA_FETCHED,
        payload: data,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('API data fetching error: ', error);
      this.setLoading(false);
    }
  }

  setCountry(country) {
    this.observer.dispatch({
      type: COUNTRY,
      payload: country,
    });
  }

  setDataType(dataType) {
    this.observer.dispatch({
      type: DATA_TYPE,
      payload: dataType,
    });
  }
}
