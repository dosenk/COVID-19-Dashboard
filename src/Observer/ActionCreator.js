import {
  LOADING, DATA_FETCHED, COUNTRY, DATA_TYPE,
} from './actionTypes';
import Fetcher from '../Fetcher/index.Fetcher';
import { COVID_API, COUNTRY_INFO_API } from '../Constants/index.Constants';
import {
  mergeData,
  addRelativeTypesData,
  countriesArrayToMap,
} from './utils.Observer';

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

  async fetchApiData() {
    this.setLoading(true);

    try {
      const covidData = await this.fetcher.getCovidInfoAll();
      const countriesData = await this.fetcher.getCountriesInfo();
      const merged = mergeData(covidData, countriesData);
      const data = addRelativeTypesData(merged);

      data.Countries = countriesArrayToMap(data.Countries);

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
