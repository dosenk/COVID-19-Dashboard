import {
  DEFAULT_PRECISION,
  WORLD_POPULATION,
} from '../Constants/index.Constants';
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

const getDataType = (dataItem, type) => {
  const hundredK = dataItem.population / 100000;
  const result = dataItem[type] / hundredK;

  return Number(result.toFixed(DEFAULT_PRECISION));
};

const getRelativeDataObj = (dataItem) => ({
  [BY_100K_CONFIRMED]: getDataType(dataItem, TOTAL_CONFIRMED),
  [BY_100K_DEATHS]: getDataType(dataItem, TOTAL_DEATHS),
  [BY_100K_RECOVERED]: getDataType(dataItem, TOTAL_RECOVERED),
  [NEW_CONFIRMED_BY_100K]: getDataType(dataItem, NEW_CONFIRMED),
  [NEW_DEATHS_BY_100K]: getDataType(dataItem, NEW_DEATHS),
  [NEW_RECOVERED_BY_100K]: getDataType(dataItem, NEW_RECOVERED),
});

const getDataTypesObj = (covidDataItem) => {
  const dataTypesObj = {
    [TOTAL_CONFIRMED]: covidDataItem.latest_data.confirmed,
    [TOTAL_DEATHS]: covidDataItem.latest_data.deaths,
    [TOTAL_RECOVERED]: covidDataItem.latest_data.recovered,
    [NEW_DEATHS]: 0,
    [NEW_RECOVERED]: 0,
    [NEW_CONFIRMED]: 0,
    population: covidDataItem.population,
  };

  if (covidDataItem.timeline.length) {
    dataTypesObj[NEW_DEATHS] = covidDataItem.timeline[0].new_deaths;
    dataTypesObj[NEW_RECOVERED] = covidDataItem.timeline[0].new_recovered;
    dataTypesObj[NEW_CONFIRMED] = covidDataItem.timeline[0].new_confirmed;
  }

  return dataTypesObj;
};

const convertTimelineObj = (timelineItem, population) => {
  const dataTypesObj = {
    [TOTAL_CONFIRMED]: timelineItem.confirmed,
    [TOTAL_DEATHS]: timelineItem.deaths,
    [TOTAL_RECOVERED]: timelineItem.recovered,
    [NEW_DEATHS]: timelineItem.new_deaths,
    [NEW_RECOVERED]: timelineItem.new_recovered,
    [NEW_CONFIRMED]: timelineItem.new_confirmed,
    date: timelineItem.date,
    population,
  };

  return {
    ...dataTypesObj,
    ...getRelativeDataObj(dataTypesObj),
  };
};

export const convertCountriesData = (countriesCovidData, countriesInfo) => {
  if (!countriesCovidData.data.length || !countriesInfo.length) {
    throw new Error('fetched data are empty');
  }

  return countriesCovidData.data.map((covidDataItem) => {
    const countryCode = covidDataItem.code;
    const countryInfoItem = countriesInfo.find(
      (countryItem) => countryItem.alpha2Code === countryCode,
    );

    const dataTypesObj = getDataTypesObj(covidDataItem);

    const timeline = covidDataItem.timeline.map((timelineItem) => {
      const result = convertTimelineObj(timelineItem, covidDataItem.population);

      return result;
    });

    return {
      ...dataTypesObj,
      ...getRelativeDataObj(dataTypesObj),
      ...countryInfoItem,
      name: covidDataItem.name,
      population: covidDataItem.population,
      date: covidDataItem.updated_at,
      timeline,
    };
  });
};

export const convertGlobalData = (globalCovid) => {
  if (!globalCovid.data || !globalCovid.data.length) {
    throw new Error('fetched data are empty');
  }

  return globalCovid.data.map((dataItem) => convertTimelineObj(dataItem, WORLD_POPULATION));
};

export const countriesArrayToMap = (countriesArray) => {
  const countriesMap = new Map();

  countriesArray.forEach((country) => {
    countriesMap.set(country.name, country);
  });

  return countriesMap;
};
