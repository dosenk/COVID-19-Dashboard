import {
  GLOBAL_COVID_URL,
  COUNTRIES_COVID_URL,
  COUNTRIES_INFO_URL,
} from './constants';

const basicFetcher = async (url) => {
  const response = await fetch(url);

  if (response.status >= 200 && response.status < 300) return response.json();

  throw new Error(response.status);
};

export const fetchGlobalCovid = () => basicFetcher(GLOBAL_COVID_URL);

export const fetchCountriesCovid = () => basicFetcher(COUNTRIES_COVID_URL);

export const fetchCountriesInfo = () => basicFetcher(COUNTRIES_INFO_URL);
