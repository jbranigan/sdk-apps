import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {IntlProvider} from 'react-intl';
import LayerList from './node_modules/boundless-sdk/js/components/LayerList.jsx';
import Playback from './node_modules/boundless-sdk/js/components/Playback.jsx';

var styleFires = new ol.style.Style({
  image: new ol.style.Icon({
    scale: 0.030000,
    anchorOrigin: 'top-left',
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    anchor: [0.5, 0.5],
    src: '/data/styles/amenity=fire_station2321243910.svg',
    rotation: 0.000000
  })
});

var map = new ol.Map({
  layers: [
    new ol.layer.Group({
      type: 'base-group',
      title: 'Base maps',
      layers: [
        new ol.layer.Tile({
          type: 'base',
          visible: false,
          title: 'None'
        }),
        new ol.layer.Tile({
          type: 'base',
          title: 'Streets',
          source: new ol.source.MapQuest({layer: 'osm'})
        }),
        new ol.layer.Tile({
          type: 'base',
          visible: false,
          title: 'Aerial',
          source: new ol.source.MapQuest({layer: 'sat'})
        })
      ]
    }),
    new ol.layer.Vector({
      opacity: 1.0,
      source: new ol.source.Vector({
        url: '/data/fires.json',
        format: new ol.format.GeoJSON()
      }),
      id: 'lyr00',
      timeInfo: {
        start: 'STARTDATED',
        end: 'OUTDATED'
      },
      style: styleFires,
      title: 'Fires',
      isSelectable: true
    })
  ],
  view: new ol.View({
    center: [-13733338.84659537, 5983866.321199833],
    zoom: 7
  })
});

var selectedLayer = map.getLayers().item(2);

export default class PlaybackApp extends React.Component {
  componentDidMount() {
    map.setTarget(ReactDOM.findDOMNode(this.refs.map));
  }
  _toggle(el) {
    if (el.style.display === 'block') {
      el.style.display = 'none';
    } else {
      el.style.display = 'block';
    }
  }
  _toggleTable() {
    this._toggle(ReactDOM.findDOMNode(this.refs.tablePanel));
    this.refs.table.refs.wrappedElement.setDimensionsOnState();
  }
  _toggleQuery() {
    this._toggle(ReactDOM.findDOMNode(this.refs.queryPanel));
  }
  _toggleEdit() {
    this._toggle(ReactDOM.findDOMNode(this.refs.editToolPanel));
  }
  _navigationFunc() {
    this.refs.info.refs.wrappedElement.activate([]);
  }
  render() {
    return (
      <article>
        <nav role='navigation'>
        </nav>
        <div id='content'>
          <div ref='map' id='map'>
            <div id='timeline'><Playback map={map} minDate={324511200000} maxDate={1385938800000} /></div>
          </div>
          <div id='layerlist'><LayerList allowFiltering={true} showOpacity={true} showDownload={true} showGroupContent={true} showZoomTo={true} allowReordering={true} map={map} /></div>
        </div>
      </article>
    );
  }
}

ReactDOM.render(<IntlProvider locale='en'><PlaybackApp /></IntlProvider>, document.getElementById('main'));