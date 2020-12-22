import {
  LOADING, DATA_FETCHED, COUNTRY, DATA_TYPE,
} from './actionTypes';
import {
  fetchCountriesCovid,
  fetchCountriesInfo,
  fetchGlobalCovid,
} from '../Fetcher/index.Fetcher';
import {
  countriesArrayToMap,
  convertCountriesData,
  convertGlobalData,
} from './utils.Observer';

export default class ActionCreator {
  constructor(observer) {
    this.observer = observer;
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
      const globalCovidTimeline = await fetchGlobalCovid();
      const countriesCovidData = await fetchCountriesCovid();
      const countriesInfo = await fetchCountriesInfo();
      const countriesArr = convertCountriesData(
        countriesCovidData,
        countriesInfo,
      );
      const Global = convertGlobalData(globalCovidTimeline);
      const Countries = countriesArrayToMap(countriesArr);
      const data = {
        Global,
        Countries,
      };

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
