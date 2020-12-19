import Leaflet from 'leaflet';
import * as CONST from '../Constants/index.Constants';
import GEO_JSON_DATA from '../assets/data/allCountriesFeatures.json';

export default class Map {
  constructor(parentElement, observer) {
    this.parent = parentElement;
    this.geoJsonData = GEO_JSON_DATA;
    this.coordinates = [53.8981064, 27.5449547];
    this.observer = observer;
    observer.subscribe(this);
  }

  start() {
    this.div = document.createElement('div');
    this.div.id = 'map';
    this.parent.append(this.div);

    this.map = Leaflet.map('map').setView(this.coordinates, 2);

    Leaflet.tileLayer(CONST.MAPBOX_API, {
      id: 'mapbox/light-v9',
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(this.map);

    if (this.infoBlock !== undefined) this.infoBlock.remove();
    this.infoBlock = Map.createInfoBlock();
    this.infoBlock.addTo(this.map);
  }

  update(state, eventType) {
    // console.log(state, eventType);
    Map.legendInfo = Map.getLegedInfo(state.dataType);

    if (this.layer !== undefined) this.map.removeLayer(this.layer);
    this.layer = Leaflet
      .geoJson(this.geoJsonData, {
        style: this.setFeatureParams.bind(state),
        onEachFeature: this.onEachFeature.bind(this),
      })
      .addTo(this.map);

    const targetCountry = state.data.Countries.get(state.country);
    if (targetCountry !== undefined) {
      let tagetCountryLayer;
      const countryName = targetCountry.Country;
      this.map.eachLayer((item) => {
        if (item.feature !== undefined) {
          if (item.feature.properties.ADMIN === countryName) tagetCountryLayer = item;
        }
      });
      this.zoomToFeature(null, tagetCountryLayer);
      this.highlightFeature(null, tagetCountryLayer);
    }
    if (this.legend !== undefined) this.legend.remove();
    this.legend = Map.createLegendBlock(state.dataType);
    this.legend.addTo(this.map);
  }

  setFeatureParams(feature) {
    const countryFeature = feature;
    const countryName = countryFeature.properties.ADMIN;
    const { dataType } = this;
    const countryCovidInfo = this.data.Countries.get(countryName);
    let covidInfoNumber = -1;
    if (countryCovidInfo !== undefined) {
      covidInfoNumber = countryCovidInfo[dataType];
      countryFeature.properties.dataType = dataType;
      countryFeature.properties.covidData = covidInfoNumber;
      countryFeature.properties.allPeople = countryCovidInfo.population;
      countryFeature.properties.flag = countryCovidInfo.flag;
      countryFeature.properties.latlng = countryCovidInfo.latlng;
    }
    return {
      fillColor: Map.getColor(covidInfoNumber, dataType),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
    };
  }

  onEachFeature(feature, layer) {
    layer.on({
      mouseover: this.highlightFeature.bind(this),
      mouseout: this.resetHighlight.bind(this),
      click: this.zoomToFeature.bind(this),
    });
  }

  static createInfoBlock() {
    const infoBlock = Leaflet.control();
    infoBlock.onAdd = function onAdd() {
      this.div = Leaflet.DomUtil.create('div', 'info');
      this.div.classList.add('animate__animated');
      this.update();
      return this.div;
    };
    infoBlock.update = function update(props) {
      if (props !== undefined) {
        this.div.classList.add('info-active', 'animate__fadeIn');
        const infoCountry = props.allPeople
          ? `<br />${props.allPeople.toLocaleString('ru')} people <br/><img src="${props.flag}"/><br/> ${props.dataType}: ${props.covidData.toLocaleString('ru')}`
          : '<br />Sorry. No information<br/>about this country.';
        this.div.innerHTML = `<b>${props.ADMIN}</b>${infoCountry}`;
      } else {
        this.div.classList.remove('info-active', 'animate__fadeIn');
      }
    };
    return infoBlock;
  }

  static createLegendBlock(dataType) {
    const legend = Leaflet.control({ position: 'bottomright' });
    legend.onAdd = function onAdd() {
      const legendDiv = Leaflet.DomUtil.create('div', 'info legend animate__animated');
      legendDiv.innerHTML = `<div class='data-type'><p>${dataType}:</p></div>`;
      legendDiv.innerHTML += `<i style="background:${Map.getColor(-1)}"></i> 
            &#60; ${Map.legendInfo[0].toLocaleString('ru')}<br>`;
      for (let i = 0; i < Map.legendInfo.length; i += 1) {
        legendDiv.innerHTML
            += `<i style="background:${Map.getColor(Map.legendInfo[i] + 0.000001)}"></i> ${
            Map.legendInfo[i].toLocaleString('ru')}${Map.legendInfo[i + 1] ? ` - ${Map.legendInfo[i + 1].toLocaleString('ru')}<br>` : ' +'}`;
      }
      legendDiv.classList.add('info-active', 'animate__fadeInRight');
      return legendDiv;
    };
    return legend;
  }

  static getLegedInfo(dataType) {
    let divider;
    switch (dataType) {
      case 'NewDeathsBy100k':
        divider = 100000;
        break;
      case 'NewConfirmedBy100k':
      case 'By100kDeaths':
      case 'NewRecoveredBy100k':
        divider = 4000;
        break;
      case 'NewDeaths':
        divider = 100;
        break;
      case 'By100kRecovered':
      case 'By100kConfirmed':
        divider = 50;
        break;
      case 'NewConfirmed':
      case 'NewRecovered':
        divider = 10;
        break;
      case 'TotalConfirmed':
        divider = 0.1;
        break;
      default:
        divider = 1;
        break;
    }
    return [
      100 / divider, 1000 / divider, 2000 / divider, 5000 / divider,
      10000 / divider, 20000 / divider, 50000 / divider, 100000 / divider,
    ];
  }

  static getColor(covidInfoNumber) {
    let countryColor = '#ffffcc';
    if (covidInfoNumber > 0) {
      if (covidInfoNumber > Map.legendInfo[7]) countryColor = '#800026';
      else if (covidInfoNumber > Map.legendInfo[6]) countryColor = '#BD0026';
      else if (covidInfoNumber > Map.legendInfo[5]) countryColor = '#E31A1C';
      else if (covidInfoNumber > Map.legendInfo[4]) countryColor = '#FC4E2A';
      else if (covidInfoNumber > Map.legendInfo[3]) countryColor = '#FD8D3C';
      else if (covidInfoNumber > Map.legendInfo[2]) countryColor = '#FEB24C';
      else if (covidInfoNumber > Map.legendInfo[1]) countryColor = '#FED976';
      else if (covidInfoNumber > Map.legendInfo[0]) countryColor = '#FFEDA0';
      return countryColor;
    }
    return countryColor;
  }

  highlightFeature(e = null, el = null) {
    const targetLayer = e === null ? el : e.target;
    targetLayer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
    });
    if (!Leaflet.Browser.ie && !Leaflet.Browser.opera && !Leaflet.Browser.edge) {
      targetLayer.bringToFront();
    }
    this.infoBlock.update(targetLayer.feature.properties);
  }

  resetHighlight(e) {
    this.layer.resetStyle(e.target);
    this.infoBlock.update();
  }

  zoomToFeature(e = null, el = null) {
    const targetLayer = e === null ? el : e.target;
    this.map.fitBounds(targetLayer.getBounds());
  }
}
