import { LOADING, INIT, DATA_FETCHED } from './actionTypes';

export default (state, action) => {
  switch (action.type) {
    case LOADING:
      return { ...state, loading: action.payload };
    case INIT:
      return {
        ...state,
        dataType: 'Total',
        loading: true,
      };
    case DATA_FETCHED:
      return { ...state, data: action.payload, loading: false };

    default:
      return state;
  }
};
