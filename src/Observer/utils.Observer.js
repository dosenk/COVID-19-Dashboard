import { DEFAULT_PRECISION } from '../Constants/index.Constants';
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

export const addType = (dataItem, type) => {
  const hundredK = dataItem.population / 100000;
  const result = dataItem[type] / hundredK;

  return Number(result.toFixed(DEFAULT_PRECISION));
};

export const getRelativeDataObj = (dataItem) => ({
  [BY_100K_CONFIRMED]: addType(dataItem, TOTAL_CONFIRMED),
  [BY_100K_DEATHS]: addType(dataItem, TOTAL_DEATHS),
  [BY_100K_RECOVERED]: addType(dataItem, TOTAL_RECOVERED),
  [NEW_CONFIRMED_BY_100K]: addType(dataItem, NEW_CONFIRMED),
  [NEW_DEATHS_BY_100K]: addType(dataItem, NEW_DEATHS),
  [NEW_RECOVERED_BY_100K]: addType(dataItem, NEW_RECOVERED),
});

export const addRelativeTypesData = (covidData) => {
  let worldPopulation = 0;

  const Countries = covidData.Countries.map((dataItem) => {
    worldPopulation += dataItem.population;

    return {
      ...dataItem,
      ...getRelativeDataObj(dataItem),
    };
  });

  const globalWithPopulation = {
    ...covidData.Global,
    population: worldPopulation,
  };
  const Global = {
    ...globalWithPopulation,
    ...getRelativeDataObj(globalWithPopulation),
  };

  return {
    Countries,
    Global,
  };
};

export const countriesArrayToMap = (countriesArray) => {
  const countriesMap = new Map();

  countriesArray.forEach((item) => {
    countriesMap.set(item.Country, item);
  });

  return countriesMap;
};

export const mergeData = (covidData, countriesData) => {
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
      latlng: countryObj.latlng,
    };
  });

  return {
    ...covidData,
    Countries,
  };
};
