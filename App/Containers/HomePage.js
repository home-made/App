import React, { Component } from "react";
import {
  AsyncStorage,
  View,
  Image,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Actions } from "react-native-router-flux";

import Promise from "bluebird";
import Auth0Lock from "react-native-lock";
import axios from "axios";


export default class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.lock = new Auth0Lock({
      clientId: "Rp7ThYPPRNHrSGUaLOv_Ub307zwDb_VR",
      domain: "stzy.auth0.com",
      useBrowser: true
    });

    this.lock.show = Promise.promisify(this.lock.show, { multiArgs: true });
    this.lock.show.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  componentDidMount() {
    console.log("HOME PAGE MOUNTED");
    this.checkStorage();
  }

  componentWillUnmount() {}

  async checkStorage() {
    try {
      const data = await AsyncStorage.multiGet([
        "profile",
        "token",
        "isAuthenticated"
      ]);
      if (data !== null && data !== undefined) {
        console.log(
          "Check storage function on Homepage.js, async data: ",
          data
        );
        if (data[2][1] === "true") {
          Actions.drawer();
        }
      }
    } catch (err) {
      console.log(
        "Check storage function on Homepage.js, Error getting data: ",
        err
      );
    }
  }

  onLogin() {
    this.lock.show(
      {
        // connections: ["touchid"]
        closeable: true
      },
      (err, profile, token) => {
        if (err) {
          console.log(err);
        } else {
          token = JSON.stringify(token);
          axios
            .get(`http://localhost:3000/chef/${profile.userId}`)
            .then(res => {
              console.log("INSIDE AXIOS REQUEST, res", res);
              profile.isChef = res.data[0].isChef;
              profile.isChef ? profile.chefView = true : profile.chefView = false;
              profile = JSON.stringify(profile);
              setStorage();
            })
            .catch(err => console.log(err));

          async function setStorage() {
          console.log('whoa')
            try {
              await AsyncStorage.multiSet(
                [
                  ["profile", profile],
                  ["token", token],
                  ["isAuthenticated", "true"]
                ],
                err =>
                  (err ? console.log("ERROR: ", err) : console.log("Info set!"))
              );
              profile = JSON.parse(profile);
              console.log("RIGHT BEFORE ACTIONS PROFILE IS", profile)
              // App.render();
              Actions.drawer();
            } catch (err) {
              console.log(
                "Set storage function on Homepage.js, Error setting data: ",
                err
              );
            }
          }
        }
      }
    );
     console.log('whoa2')
  }

  showDrawer() {
    console.log("OPEN");
    Actions.refresh({ key: "drawerChildrenWrapper", open: value => !value });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require("./img/turquoise-top-gradient-background.jpg")}
          style={styles.backgroundImage}
        />
        {/*<ActivityIndicator
          size='large'
          color='#0000ff'
          animating='true'
        />*/}
        <TouchableHighlight onPress={this.onLogin}>
          <Text style={styles.welcome}>
            Log In
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    resizeMode: "cover"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cccccc"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    color: "#ffffff"
  }
});