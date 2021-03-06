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
import Icon from "react-native-vector-icons/Entypo";
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

  componentWillMount() {
    let location = this.props.getLocation();
    region = {
      latitude: location.lat,
      longitude: location.lon,
      latitudeDelta: 0.0922,
      longitudeDelta: width / height * 0.0922
    };
    this.setState({ region }, () => {
      axios
        .post("http://homemadeapp.org:3000/chefTest", {
          lat: this.state.region.latitude,
          lon: this.state.region.longitude
        })
        .then(chefsInRange => {
          this.setState({ data: chefsInRange.data });
        })
        .catch(err => console.log(err));
    });
  }

  render() {
    if (this.props.singleChef) {
      let latlng = {
        latitude: this.props.singleChef.latitude,
        longitude: this.props.singleChef.longitude
      };

      return (
        <View style={{ flex: 1, marginTop: -40 }}>
          <View style={styles.container}>
            <MapView
              showsUserLocation={true}
              style={styles.map}
              region={this.props.singleChef}
            >
              <MapView.Marker coordinate={latlng} />
            </MapView>
          </View>
        </View>
      );
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
                  latlng: {
                    latitude: chef.location.geo_lat,
                    longitude: chef.location.geo_lng
                  },
                  title: name
                };

                return (
                  <MapView.Marker coordinate={coords.latlng}>
                    <MapView.Callout style={{ width: "auto" }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 5
                        }}
                      >
                        <Text
                          onPress={() => this.props.setChef(chef)}
                          style={styles.text}
                        >
                          {name}
                        </Text>
                        <Icon
                          size={20}
                          onPress={() => this.props.setChef(chef)}
                          style={{
                            marginTop: 2,
                            marginLeft: 5,
                            height: 20,
                            color: "#505050"
                          }}
                          name="chevron-with-circle-right"
                        />
                      </View>
                    </MapView.Callout>
                  </MapView.Marker>
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
  },
  text: {
    color: "#505050",
    fontFamily: "Noteworthy-Bold",
    fontSize: 18
  }
});
