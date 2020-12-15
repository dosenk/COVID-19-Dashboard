import {
  LOADING,
  ALL_COVID_DATA,
  DISPLAYING_DATA,
  COUNTRY,
} from './actionTypes';
import Fetcher from '../Fetcher/index.Fetcher';
import { COVID_API, COUNTRY_INFO_API } from '../Constants/index.Constants';

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

  fetchAllCovidInfo() {
    this.setLoading(true);

    this.fetcher
      .getCovidInfoAll()
      .then((allCovidInfo) => {
        this.observer.dispatch({
          type: ALL_COVID_DATA,
          payload: allCovidInfo,
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.setLoading(false);
      });
  }

  fetchOptionalInfo(country, dataType) {
    this.fetcher
      .getOptionsCovidInfo(this.observer.state.allCovid, dataType, country)
      .then((data) => {
        this.observer.dispatch({
          type: DISPLAYING_DATA,
          payload: { country, dataType, data },
        });
      });
  }

  setCountry(country) {
    this.observer.dispatch({
      type: COUNTRY,
      payload: country,
    });
  }

  setDataType(dataType) {
    const { country } = this.observer.state;

    this.fetchOptionalInfo(country, dataType);
  }
}
