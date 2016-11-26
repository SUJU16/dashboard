import React from 'react'
import { connect } from 'react-redux'
import { setLocation, setZoomLevel, toggleLayer, uploadPoint, getLocation } from '../store/actions'
import PeopleIcon from 'react-icons/lib/io/ios-body'
import ClusterIcon from 'react-icons/lib/io/ios-circle-filled'
import NavIcon from 'react-icons/lib/io/ios-navigate-outline'
import BusIcon from 'react-icons/lib/io/android-bus'

import Page from './Page'
import style from '../styles/Map.scss'

import { Map, TileLayer, LayerGroup, Circle, Polyline } from 'react-leaflet';

var colors = {}

const getColor = (id, size = undefined, ) => {
  if (!colors[id] && size) {
    colors[id] = `rgb(${Math.floor(size)}, ${Math.floor(0)}, ${Math.floor(255 - size)})`
  }
  return colors[id]
}

const getRandomColor = (id) => {
  if (!colors[id+'lol']) {
    colors[id+'lol'] = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
  }
  return colors[id+'lol']
}

const renderClusters = (clusters, clustered_datapoints, clustersEnabled) => {
  if (clusters && clustersEnabled) {
    var elems = []
    if (clusters) {
      clusters.map(cluster => {
        elems.push(<Circle key={cluster.id} center={{ lat: cluster.latitude, lon: cluster.longitude }} color={getColor(cluster.id, cluster.radius)} radius={cluster.radius} weight={1} opacity={0.5}/>)
      })
    }
    if (clustered_datapoints) {
      clustered_datapoints.map(point => {
        elems.push(<Circle key={point.id} center={{ lat: point.latitude, lon: point.longitude }} color={getColor(point.cluster_id)} radius={20} weight={1} opacity={0.5}/>)
      })
    }
    console.log(elems)
    return elems
  } else {
    return null
  }
}

const MapView = ({ datapoints, clusters, clustered_datapoints, location, zoomLevel, peopleEnabled, clustersEnabled, userEnabled, routesEnabled, routes, setLocation, setZoomLevel, toggleLayer, newPoint, getAndSetLocation }) => (
  <div className={style.container}>
    <div className={style.sidebar + ' ' + style.middle}>
      <button disabled={!datapoints} className={peopleEnabled ? style.buttonEnabled : ''} onClick={toggleLayer.bind(this, "people")}><PeopleIcon size={24}/></button>
      <button disabled={!clusters} className={clustersEnabled ? style.buttonEnabled : ''} onClick={toggleLayer.bind(this, "clusters")}><ClusterIcon size={24}/></button>
      <button disabled={!routes} className={routesEnabled ? style.buttonEnabled : ''} onClick={toggleLayer.bind(this, "routes")}><BusIcon size={24}/></button>
    </div>
    <div className={style.sidebar + ' ' + style.bottom}>
      <button onClick={getAndSetLocation}>
        <NavIcon size={24} />
      </button>
    </div>
    {location ?
      <Map className={style.map}
        center={location}
        zoom={zoomLevel}
        onZoom={setZoomLevel}
        onClick={newPoint}>
        <LayerGroup>
          <TileLayer
            className={style.tileLayer}
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
            />
          { (datapoints && peopleEnabled && !clustersEnabled) ? datapoints.map(point => {
            const coords = {
              lat: point.latitude,
              lon: point.longitude
            }
            return (<Circle key={point.id} center={coords} color={clustersEnabled ? getColor(point.cluster_id) : '#2366b4'} weight={0.5} radius={20} fillOpacity={1} />)
          }) : null}
          {renderClusters(clusters, clustered_datapoints, clustersEnabled)}
          { userEnabled && location ? (
            <Circle center={location} color={'#2bcc8d'} fillColor={'#2b986e'} radius={10} weight={3} fillOpacity={1}/>
          ) : null}
          { routes && routesEnabled ? routes.map(route => {
            if (route.id) {
              return (<Polyline positions={route.positions} key={route.id} color={getRandomColor(route.id)} weight={2} smoothFactor={1} />)
            }
          }) : null}
        </LayerGroup>
      </Map>
      : 'Loading location'}
  </div>
)

const mapStateToProps = (state) => ({
  datapoints: state.clusters.datapoints,
  clusters: state.clusters.clusters,
  clustered_datapoints: state.clusters.clustered_datapoints,
  location: state.preferences.location,
  zoomLevel: state.preferences.zoomLevel,
  peopleEnabled: state.preferences.layers.people,
  clustersEnabled: state.preferences.layers.clusters,
  userEnabled: state.preferences.layers.user,
  routesEnabled: state.preferences.layers.routes,
  routes: state.preferences.routes
})

const mapDispatchToProps = (dispatch) => {
  return {
    setLocation: (location) => dispatch(setLocation(location)),
    setZoomLevel: (zoomLevel) => dispatch(setZoomLevel(zoomLevel)),
    toggleLayer: (id) => dispatch(toggleLayer(id)),
    newPoint: (e) => dispatch(uploadPoint(e)),
    getAndSetLocation: () => {
      dispatch(toggleLayer('user'))
      dispatch(getLocation())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapView)
