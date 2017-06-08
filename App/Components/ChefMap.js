import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Linking,
  ActivityIndicator
} from "react-native";
import MapView from "react-native-maps";
import { Actions, Router, Scene, Modal } from "react-native-router-flux";
import GetGeoLocation from "../utils/GetGeoLocation";
import axios from "axios";
const { width, height } = Dimensions.get("window");
export default class ChefMap extends Component {
  constructor(props) {
    super(props);
   
    this.state = {
      mapLoaded: false,
      data: []
    };
  }

  // watchID: ?number = null;

  // giveDirections(chef) {
  //   const rla = this.state.region.latitude;
  //   const rlo = this.state.region.longitude;

  //   const la = chef.location.geo_lat;
  //   const lo = chef.location.geo_lng;

  //   const url = `http://maps.apple.com/?saddr=${rla},${rlo}&daddr=${la},${lo}&dirflg=d`;
  //   // const url = `http://maps.apple.com/?saddr=${rla},${rlo}&daddr=106+Austin+Dr+Folsom+CA&dirflg=d`;
  //   console.log(Linking.openURL(url));
  //   return Linking.openURL(url);
  // }
  componentWillMount() {
    let location = this.props.getLocation();
    console.log("LOCATION IN WILL MOUNT")
    region = {
        latitude: location.lat,
        longitude: location.lon,
        latitudeDelta: 0.0922,
        longitudeDelta: width / height * 0.0922 
    }
    this.setState({region}, () => {
      axios
      .post("http://localhost:3000/chefTest", {
        lat: this.state.region.latitude,
        lon: this.state.region.longitude
      })
      .then(chefsInRange => {
        console.log(chefsInRange)
        this.setState({ data: chefsInRange.data });
      })
      .catch(err => console.log(err));
    })
  }

  componentDidMount() {
    var context = this;
    //NEED TO CHANGE TEST ROUTE TO GET CHEF DATA
    //MUST AMEND BACKEND ROUTES

    // GetGeoLocation(context);
  }

  componentWillUnmount() {
    // navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    if (this.props.singleChef) {
      let latlng = {
        latitude: this.props.singleChef.latitude,
        longitude: this.props.singleChef.longitude
      }

      return ( 
        <View style={{ flex: 1, marginTop: -40 }}>
          <View style={styles.container}>
            <MapView 
              showsUserLocation={true}
              style={styles.map}
              region={this.props.singleChef}
            >
            <MapView.Marker
              coordinate={latlng}

            />
            </MapView>
          </View>
        </View>
      )
    
    } else {

    
    return (
      <View style={{ flex: 1, marginTop: -40 }}>
        <View style={styles.container}>
          
          <MapView
            showsUserLocation={true}
            style={styles.map}
            region={this.state.region}
          >
            {this.state.data.map((chef, idx) => {
              var name = chef.firstName + " " + chef.lastName;
              var coords = {
                latlng : {
                  latitude: chef.location.geo_lat,
                  longitude: chef.location.geo_lng
                },
                title: name
              };

              return (
                <MapView.Marker
                  onPress={() => this.props.setChef(chef)}
                  key={name}
                  coordinate={coords.latlng}
                  title={name}
                />
              );
            })}
          </MapView>
        </View>
      </View>
    );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    top: 100,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
