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

  update(state, eventType) {
    // console.log(state.data);
    const targetCountry = state.data.Countries.get(state.country);
    let tagetCountryLayer;
    if (targetCountry !== undefined) {
      const countryName = targetCountry.Country;
      this.map.eachLayer((item) => {
        if (item.feature !== undefined) {
          if (item.feature.properties.ADMIN === countryName) {
            tagetCountryLayer = item;
          }
        }
      });
      this.zoomToFeature(null, tagetCountryLayer);
      this.highlightFeature(null, tagetCountryLayer);
    }

    if (this.layer !== undefined) this.map.removeLayer(this.layer);
    this.layer = Leaflet
      .geoJson(this.geoJsonData, {
        style: this.setFeatureParams.bind(state),
        onEachFeature: this.onEachFeature.bind(this),
      })
      .addTo(this.map);
  }

  start() {
    this.div = document.createElement('div');
    this.div.id = 'mapid';
    this.parent.append(this.div);

    this.map = Leaflet.map('mapid').setView(this.coordinates, 2);

    Leaflet.tileLayer(CONST.MAPBOX_API, {
      id: 'mapbox/light-v9',
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(this.map);

    this.infoBlock = Map.createInfoBlock();
    this.infoBlock.addTo(this.map);
  }

  static createInfoBlock() {
    const infoBlock = Leaflet.control();
    infoBlock.onAdd = function onAdd() {
      this.div = Leaflet.DomUtil.create('div', 'info');
      this.update();
      return this.div;
    };
    infoBlock.update = function update(props) {
      this.div.innerHTML = (props !== undefined)
        ? `<b>${props.ADMIN}</b><br />${props.allPeople} people <br /><img src="${props.flag}"/><br />  ${props.dataType}: ${props.covidData}`
        : '';
    };
    return infoBlock;
  }

  static getColor(info, dataType) {
    let divider = 1;
    switch (dataType) {
      case 'NewConfirmedBy100k':
      case 'NewDeathsBy100k':
      case 'By100kDeaths':
      case 'NewRecoveredBy100k':
        divider = 1000;
        break;
      case 'By100kRecovered':
      case 'By100kConfirmed':
        divider = 10;
        break;
      default:
        divider = 1;
        break;
    }
    let countryColor = '#ffffcc';
    if (info > 100000 / divider) countryColor = '#800026';
    else if (info > 50000 / divider) countryColor = '#BD0026';
    else if (info > 20000 / divider) countryColor = '#E31A1C';
    else if (info > 10000 / divider) countryColor = '#FC4E2A';
    else if (info > 5000 / divider) countryColor = '#FD8D3C';
    else if (info > 2000 / divider) countryColor = '#FEB24C';
    else if (info > 1000 / divider) countryColor = '#FED976';
    else if (info > 100 / divider) countryColor = '#FFEDA0';
    return countryColor;
  }

  setFeatureParams(feature) {
    const countryFeature = feature;
    const countryName = countryFeature.properties.ADMIN;
    const { dataType } = this;
    const countryCovidInfo = this.data.Countries.get(countryName);
    let covidInfoNumber = 1;
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
    console.log(targetLayer);
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

  onEachFeature(feature, layer) {
    layer.on({
      mouseover: this.highlightFeature.bind(this),
      mouseout: this.resetHighlight.bind(this),
      click: this.zoomToFeature.bind(this),
    });
  }
}
