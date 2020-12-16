import {
  LOADING, DATA_FETCHED, COUNTRY, DATA_TYPE,
} from './actionTypes';
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
  TOTAL_CONFIRMED,
  TOTAL_DEATHS,
  TOTAL_RECOVERED,
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

  static addRelativeTypesData(covidData, countriesData) {
    if (!covidData.Countries.length || !countriesData.length) {
      throw new Error("Can't find required properties in fetched data");
    }

    const addType = (covidDataObj, type, hundredK) => {
      const result = covidDataObj[type] / hundredK;

      return result.toFixed(DEFAULT_PRECISION);
    };

    return covidData.Countries.map((covidDataObj) => {
      const country = covidDataObj.Country;
      const countryObj = countriesData.find(
        (countiesDataItem) => countiesDataItem.name === country,
      );

      if (!countryObj) return covidDataObj;

      const hundredK = countryObj.population / 100000;

      return {
        ...covidDataObj,
        [BY_100K_CONFIRMED]: addType(covidDataObj, TOTAL_CONFIRMED, hundredK),
        [BY_100K_DEATHS]: addType(covidDataObj, TOTAL_DEATHS, hundredK),
        [BY_100K_RECOVERED]: addType(covidDataObj, TOTAL_RECOVERED, hundredK),
      };
    });
  }

  async fetchApiData() {
    this.setLoading(true);

    try {
      const covidData = await this.fetcher.getCovidInfoAll();
      const countriesData = await this.fetcher.getCountriesInfo();

      covidData.Countries = ActionCreator.addRelativeTypesData(
        covidData,
        countriesData,
      );

      this.observer.dispatch({
        type: DATA_FETCHED,
        payload: { countriesData, covidData },
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
