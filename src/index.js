import './styles/index.scss';
import Fetcher from './Fetcher/index.[fetcher]';

document.body.onload = async () => {
  const covidApiPath = 'https://api.covid19api.com';
  const countryInfoApiPath = 'https://restcountries.eu/rest/v2';
  const fetcher = new Fetcher(covidApiPath, countryInfoApiPath);
  const allCovidInfo = await fetcher.getCovidInfoAll();

  // можно указывать без периода - тогда выдаст данные за весь период
  // const allCovidInfoByPeriod = await fetcher.getCovidInfoByCountryPeriod('Belarus', '2020-12-02');
  // console.log(allCovidInfoByPeriod);

  //  'NewDeaths', 'NewConfirmed', 'NewRecovered', 'TotalDeaths', 'TotalConfirmed', 'TotalRecovered'
  // New - last day, Total - all time, 'ALL' - all world, 'Afghanistan' - country
  // console.log(await fetcher.getOptionsCovidInfo(allCovidInfo, 'NewConfirmed'));
  // console.log(await fetcher.getOptionsCovidInfo(allCovidInfo, 'NewRecovered', 'Russian Federation'));
  // console.log(await fetcher.getOptionsCovidInfo(allCovidInfo, 'NewDeaths', 'ALL'));
  // console.log(await fetcher.getOptionsCovidInfo(allCovidInfo, 'TotalConfirmed', 'Belarus'));
  // console.log(await fetcher.getOptionsCovidInfo(allCovidInfo, 'TotalRecovered', 'Afghanistan'));
  // console.log(await fetcher.getOptionsCovidInfo(allCovidInfo, 'TotalDeaths', 'Afghanistan'));
};
