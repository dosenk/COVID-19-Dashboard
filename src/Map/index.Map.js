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
    const targetCountry = state.data.Countries[state.country];
    let tagetCountryLayer;
    if (targetCountry !== undefined) {
      const countryName = state.data.Countries[state.country].Country;
      this.map.eachLayer((item) => {
        if (item.feature !== undefined) {
          if (item.feature.properties.ADMIN === countryName) {
            tagetCountryLayer = item;
          }
        }
      });
      this.map.fitBounds(tagetCountryLayer.getBounds());
      this.highlightFeature(null, tagetCountryLayer);
    }

    if (this.layer !== undefined) this.map.removeLayer(this.layer);
    this.layer = Leaflet
      .geoJson(this.geoJsonData, {
        style: this.style.bind(state),
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

    this.info = Leaflet.control();

    this.info.onAdd = function () {
      this.div = Leaflet.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this.div;
    };

    this.info.update = function (props) {
      // console.log(props);
      this.div.innerHTML = `<h4>Country:</h4>${props
        ? `<b>${props.ADMIN}</b><br />${props.allPeople} people <br /><img src="${props.flag}"/><br />  ${props.dataType}: ${props.covidData}`
        : 'Hover over a state'}`;
    };

    this.info.addTo(this.map);
  }

  static getColor(info, dataType) {
    // const maxValuesParam = {
    //   NewConfirmed: 190000,
    //   TotalConfirmed: 16000000,
    //   NewDeaths: 3000,
    //   TotalDeaths: 300000,
    //   NewRecovered: 48000,
    //   TotalRecovered: 900000,
    //   NewConfirmedBy100k: 210,
    //   By100kConfirmed: 9400,
    //   NewDeathsBy100k: 3.7,
    //   By100kDeaths: 160,
    //   NewRecoveredBy100k: 230,
    //   By100kRecovered: 8500,
    // };
    let q = 1;
    switch (dataType) {
      case 'NewConfirmedBy100k':
      case 'NewDeathsBy100k':
      case 'By100kDeaths':
      case 'NewRecoveredBy100k':
        q = 1000;
        break;
      case 'By100kRecovered':
      case 'By100kConfirmed':
        q = 10;
        break;
      default:
        q = 1;
        break;
    }
    return info > 100000 / q ? '#800026'
      : info > 50000 / q ? '#BD0026'
        : info > 20000 / q ? '#E31A1C'
          : info > 10000 / q ? '#FC4E2A'
            : info > 5000 / q ? '#FD8D3C'
              : info > 2000 / q ? '#FEB24C'
                : info > 1000 / q ? '#FED976'
                  : info > 100 / q ? '#FFEDA0'
                    : '#ffffcc';
  }

  style(feature) {
    const country = feature.properties.ADMIN;
    const { dataType } = this;
    const countryCovidInfo = this.data.Countries.filter((item) => item.Country === country);
    let property = 1;
    if (countryCovidInfo.length !== 0) {
      property = countryCovidInfo[0][dataType];
      feature.properties.dataType = dataType;
      feature.properties.covidData = property;
      feature.properties.allPeople = countryCovidInfo[0].population;
      feature.properties.flag = countryCovidInfo[0].flag;
      feature.properties.latlng = countryCovidInfo[0].latlng;
    }
    return {
      fillColor: Map.getColor(property, dataType),
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
    this.info.update(targetLayer.feature.properties);
  }

  resetHighlight(e) {
    this.layer.resetStyle(e.target);
    this.info.update();
  }

  zoomToFeature(e) {
    this.map.fitBounds(e.target.getBounds());
  }

  onEachFeature(feature, layer) {
    layer.on({
      mouseover: this.highlightFeature.bind(this),
      mouseout: this.resetHighlight.bind(this),
      click: this.zoomToFeature.bind(this),
    });
  }
}
