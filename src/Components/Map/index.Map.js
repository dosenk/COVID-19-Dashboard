import Leaflet from 'leaflet';
import Slider from '../Slider/index.Slider';
import * as COVID_TYPES from '../../Constants/dataTypes';
import {
  MAPBOX_API, MAPBOX_ID, LEGEND_COLOR_DEFAULT, LEGEND_COLORS, DEFAULT_COORDINATES, MAP_ID,
} from './constants';
import { DATA_TYPES_VALUES, DATA_TYPES_DECRYPTION } from '../../Constants/index.Constants';
import GEO_JSON_DATA from '../../assets/data/allCountriesFeatures.json';

export default class Map {
  constructor(parentElement, observer) {
    this.parent = parentElement;
    this.legend = this.createLegendBlock();
    this.slider = new Slider(observer);
    this.observer = observer;
    observer.subscribe(this);
  }

  start() {
    this.div = document.createElement('div');
    this.div.id = MAP_ID;
    this.parent.append(this.div);

    this.map = Leaflet.map(MAP_ID).setView(DEFAULT_COORDINATES, 2);

    Leaflet.tileLayer(MAPBOX_API, {
      id: MAPBOX_ID,
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(this.map);

    if (this.infoBlock !== undefined) this.infoBlock.remove();
    this.infoBlock = Map.createInfoBlock();
    this.infoBlock.addTo(this.map);

    this.legend.addTo(this.map);
    this.legendDiv = this.legend.getContainer();
    this.legendDiv.childNodes[0].append(this.slider.getContainer());
    this.slider.start();
  }

  update(state) {
    Map.legendInfo = Map.getLegedInfo(state.dataType);
    if (this.layer !== undefined) this.map.removeLayer(this.layer);
    this.layer = Leaflet
      .geoJson(GEO_JSON_DATA, {
        style: this.setFeatureParams.bind(state),
        onEachFeature: this.onEachFeature.bind(this),
      })
      .addTo(this.map);

    const targetCountry = state.data.Countries.get(state.country);
    if (targetCountry !== undefined) {
      let tagetCountryLayer;
      const countryName = targetCountry.name;
      this.map.eachLayer((item) => {
        if (item.feature !== undefined) {
          if (item.feature.properties.ADMIN === countryName
            || item.feature.properties.ISO_A3 === countryName) tagetCountryLayer = item;
        }
      });
      this.zoomToFeature(null, tagetCountryLayer);
      this.highlightFeature(null, tagetCountryLayer);
    }
    Map.addLegendInfo(this.legendDiv.childNodes[1]);
  }

  setFeatureParams(feature) {
    const countryFeature = feature;
    const countryName = countryFeature.properties.ADMIN;
    const countryIsoName = countryFeature.properties.ISO_A3;
    const { dataType } = this;
    const countryCovidInfo = this.data.Countries.get(countryName)
      || this.data.Countries.get(countryIsoName);
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
      this.div.overFlag = false;
      this.div.onmouseover = (e) => {
        if (e.target.closest('.info')) this.div.overFlag = true;
        this.div.onmouseout = () => {
          this.div.overFlag = false;
          this.update();
        };
      };
      this.div.classList.add('animate__animated');
      this.update();
      return this.div;
    };
    infoBlock.update = function update(props) {
      if (props !== undefined) {
        setTimeout(() => {
          this.div.classList.add('info-active', 'animate__fadeIn');
          const infoCountry = props.allPeople
            ? `<br />${props.allPeople.toLocaleString('ru')} people <br/><img src="${props.flag}"/><br/> ${Map.getDataTypeText(props.dataType)}: ${props.covidData.toLocaleString('ru')}`
            : '<br />Sorry. No information<br/>about this country.';
          this.div.innerHTML = `<b>${props.ADMIN}</b>${infoCountry}`;
        });
      } else {
        setTimeout(() => {
          if (this.div.overFlag === true) return;
          this.div.classList.remove('info-active', 'animate__fadeIn');
        });
      }
    };
    return infoBlock;
  }

  static getDataTypeText(dataType) {
    const indexDataType = DATA_TYPES_VALUES.indexOf(dataType);
    return DATA_TYPES_DECRYPTION[indexDataType];
  }

  createLegendBlock() {
    const legend = Leaflet.control({ position: 'bottomright' });
    legend.onAdd = function onAdd() {
      const legendDiv = Leaflet.DomUtil.create('div', 'info legend info-active');
      const legendSlider = Leaflet.DomUtil.create('div', 'slider');
      const legendColors = Leaflet.DomUtil.create('div', 'info-colors');
      legendDiv.append(legendSlider, legendColors);
      return legendDiv;
    };
    legend.onAdd.bind(this);
    return legend;
  }

  static addLegendInfo(legendDiv) {
    const div = legendDiv;
    div.innerHTML = `<i style="background:${Map.getColor(-1)}"></i> 
            &#60; ${Map.legendInfo[0].toLocaleString('ru')}<br>`;
    for (let i = 0; i < Map.legendInfo.length; i += 1) {
      div.innerHTML
            += `<i style="background:${Map.getColor(Map.legendInfo[i] + 0.000001)}"></i> ${
          Map.legendInfo[i].toLocaleString('ru')}${Map.legendInfo[i + 1] ? ` - ${Map.legendInfo[i + 1].toLocaleString('ru')}<br>` : ' +'}`;
    }
  }

  static getLegedInfo(dataType) {
    let divider;
    switch (dataType) {
      case COVID_TYPES.NEW_DEATHS_BY_100K:
        divider = 100000;
        break;
      case COVID_TYPES.NEW_CONFIRMED_BY_100K:
      case COVID_TYPES.BY_100K_DEATHS:
      case COVID_TYPES.NEW_RECOVERED_BY_100K:
        divider = 4000;
        break;
      case COVID_TYPES.NEW_DEATHS:
        divider = 100;
        break;
      case COVID_TYPES.BY_100K_RECOVERED:
      case COVID_TYPES.BY_100K_CONFIRMED:
        divider = 50;
        break;
      case COVID_TYPES.NEW_CONFIRMED:
      case COVID_TYPES.NEW_RECOVERED:
        divider = 10;
        break;
      case COVID_TYPES.TOTAL_CONFIRMED:
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
    let countryColor = LEGEND_COLOR_DEFAULT;
    if (covidInfoNumber > 0) {
      if (covidInfoNumber > Map.legendInfo[7]) [,,,,,,, countryColor] = LEGEND_COLORS;
      else if (covidInfoNumber > Map.legendInfo[6]) [,,,,,, countryColor] = LEGEND_COLORS;
      else if (covidInfoNumber > Map.legendInfo[5]) [,,,,, countryColor] = LEGEND_COLORS;
      else if (covidInfoNumber > Map.legendInfo[4]) [,,,, countryColor] = LEGEND_COLORS;
      else if (covidInfoNumber > Map.legendInfo[3]) [,,, countryColor] = LEGEND_COLORS;
      else if (covidInfoNumber > Map.legendInfo[2]) [,, countryColor] = LEGEND_COLORS;
      else if (covidInfoNumber > Map.legendInfo[1]) [, countryColor] = LEGEND_COLORS;
      else if (covidInfoNumber > Map.legendInfo[0]) [countryColor] = LEGEND_COLORS;
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
