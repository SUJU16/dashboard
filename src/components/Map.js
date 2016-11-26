import React from 'react'
import { connect } from 'react-redux'
import { setLocation, setZoomLevel } from '../store/actions'

import Page from './Page'
import style from '../styles/Map.scss'

import { Map, TileLayer, LayerGroup, Circle } from 'react-leaflet';

const MapView = ({ datapoints, clusters, location, zoomLevel, setLocation, setZoomLevel }) => (
  <div className={style.container}>
  {location ?
    <Map className={style.map} center={location} zoom={zoomLevel} onZoom={setZoomLevel}>
      <LayerGroup>
        <TileLayer
          className={style.tileLayer}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
          />
        { datapoints ? datapoints.map(point => {
          const coords = {
            lat: point.latitude,
            lon: point.longitude
          }
          return (<Circle key={point.id} center={coords} radius={20} />)
        }) : null}
        { clusters ? clusters.map(point => {
          const coords = {
            lat: point.latitude,
            lon: point.longitude
          }
          return (<Circle key={point.id} center={coords} color={'#0eff10'} radius={point.radius} />)
        }) : null}
      </LayerGroup>
    </Map>
    : 'Loading location'}
  </div>
)

const mapStateToProps = (state) => ({
  datapoints: state.clusters.datapoints,
  clusters: state.clusters.clusters,
  location: state.preferences.location,
  zoomLevel: state.preferences.zoomLevel
})

const mapDispatchToProps = ({
  setLocation,
  setZoomLevel
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapView)
