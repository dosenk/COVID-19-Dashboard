const COVID_API = 'https://corona-api.com/';
export const GLOBAL_COVID_URL = new URL('/timeline', COVID_API);
export const COUNTRIES_COVID_URL = new URL(
  '/countries?include=timeline',
  COVID_API,
);
export const COUNTRIES_INFO_URL = new URL(
  '?fields=name;population;flag;alpha2Code;latlng',
  'https://restcountries.eu/rest/v2/all',
);
