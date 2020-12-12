import './styles/index.scss';
import Fetcher from './Fetcher/index.[fetcher]';

document.body.onload = async () => {
  const covidApiPath = 'https://api.covid19api.com/summary';
  const countryInfoApiPath = 'https://restcountries.eu/rest/v2/all?fields=name;population';
  const fetcher = new Fetcher(covidApiPath, countryInfoApiPath);
  const allCovidInfo = await fetcher.getAllCovidInfo();
  //  'NewDeaths', 'NewConfirmed', 'NewRecovered', 'TotalDeaths', 'TotalConfirmed', 'TotalRecovered'
  // New - last day, Total - all time, 'ALL' - all world, 'afghanistan'(slug) - country

  // console.log(await fetcher.getOptionsCovidInfo(allCovidInfo, 'NewConfirmed'));
  // console.log(await fetcher.getOptionsCovidInfo(allCovidInfo, 'NewRecovered', 'russia'));
  // console.log(await fetcher.getOptionsCovidInfo(allCovidInfo, 'NewDeaths', 'ALL'));
  // console.log(await fetcher.getOptionsCovidInfo(allCovidInfo, 'TotalConfirmed', 'belarus'));
  // console.log(await fetcher.getOptionsCovidInfo(allCovidInfo, 'TotalRecovered', 'afghanistan'));
  // console.log(await fetcher.getOptionsCovidInfo(allCovidInfo, 'TotalDeaths', 'afghanistan'));
};
