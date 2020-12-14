import { LOADING, DATA_FETCHED } from './actionTypes';
import Fetcher from '../Fetcher/index.Fetcher';
import {
  COVID_API,
  COUNTRY_INFO_API,
  CORS_ANYWHERE,
} from '../Constants/index.Constants';

export default class ActionCreator {
  constructor(observer) {
    this.observer = observer;
    this.fetcher = new Fetcher(
      `${CORS_ANYWHERE}${COVID_API}`,
      COUNTRY_INFO_API
    );
  }

  setLoading(isLoading = true) {
    this.observer.dispatch({
      type: LOADING,
      payload: isLoading,
    });
  }

  setFetchedData(data) {
    this.observer.dispatch({
      type: DATA_FETCHED,
      payload: data,
    });
  }

  fetchCountryData(country = 'all') {
    this.setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        const allCovidInfo = await this.fetcher.getCovidInfoAll();
        const data = await this.fetcher.getOptionsCovidInfo(
          allCovidInfo,
          this.observer.state.dataType,
          country
        );

        resolve(data);
      } catch (e) {
        reject(e);
      }
    });

    promise
      .then(data => {
        this.setFetchedData(data);
      })
      .catch(error => {
        console.error(error);
        this.setLoading(false);
      });
  }
}
