import FilterByLocation from './FilterByLocation';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

module.exports = (mapContext) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {

      var region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };

      var mapLoaded = true;      
      
      mapContext.setState({mapLoaded, region});
      
      FilterByLocation(mapContext, region);

    },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

    mapContext.watchID = navigator.geolocation.watchPosition((position) => {
      var regionChange = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }; 
      var mapLoaded = true;
      mapContext.setState({mapLoaded, region: regionChange});

    });
}