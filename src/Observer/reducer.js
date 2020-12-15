import {
  DEFAULT_COUNTRY,
  DEFAULT_DATA_TYPE,
} from '../Constants/index.Constants';
import {
  LOADING,
  INIT,
  ALL_COVID_DATA,
  DISPLAYING_DATA,
  COUNTRY,
} from './actionTypes';

export default (state, action) => {
  switch (action.type) {
    case INIT:
      return {
        loading: true,
        country: DEFAULT_COUNTRY,
        dataType: DEFAULT_DATA_TYPE,
        allCovid: {},
        displayingData: {},
        ...state,
      };
    case LOADING:
      return { ...state, loading: action.payload };
    case COUNTRY:
      return { ...state, country: action.payload };
    case ALL_COVID_DATA:
      return {
        ...state,
        loading: false,
        allCovid: action.payload,
        displayingData: action.payload.Countries,
      };
    case DISPLAYING_DATA:
      return {
        ...state,
        country: action.payload.country,
        dataType: action.payload.dataType,
        displayingData: action.payload.data,
      };

    default:
      return state;
  }
};
