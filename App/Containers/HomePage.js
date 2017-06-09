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
import { Actions, ActionConst } from "react-native-router-flux";
import AnimatedLinearGradient from "react-native-animated-linear-gradient";

import Promise from "bluebird";
import Auth0Lock from "react-native-lock";
import axios from "axios";
import SocketIO from "socket.io-client";
var socket;

export default class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.options = {
      closeable: true,
      languageDictionary: {
        title: "Homemade"
      }
    };

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
    let saveUser;
    this.lock.show(
      {
        // connections: ["touchid"]
        closable: true
      },
      (err, profile, token) => {
        if (err) {
          console.log(err);
        } else {
          token = JSON.stringify(token);
          /* after we log into the app, we make a post request
             that either finds or creates a user. we find out 
             if user is a chef or not */
          axios
            .post(`http://homemadeapp.org:3000/user/${profile.userId}`, profile)
            .then(user => {
              saveUser = user.data;
              if (user.data.profileUrl) {
                profile.extraInfo.picture_large = user.data.profileUrl;
                profile.picture = user.data.profileUrl;
              }

              if (user.data.isChef) {
                profile.isChef = true;
                profile.chefView = true;
                profile = JSON.stringify(profile);
                setStorage();
              } else {
                profile.chefView = false;
                profile.isChef = false;
                profile = JSON.stringify(profile);
                setStorage();
              }
            })
            .catch(err => console.log(err));

          async function setStorage() {
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
              if (saveUser.phoneNumber) {
                Actions.drawer();
              } else {
                Actions.drawer({ saveUser });
              }
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
  }

  showDrawer() {
    Actions.refresh({ key: "drawerChildrenWrapper", open: value => !value });
  }

  render() {
    const colorScheme = {
      homemade: [
        "#9EECF0",
        "#9EF0EA",
        "#9EF0DA",
        "#9EF0CE",
        "#9EF0B6",
        "#9EF0A0",
        "#B2F09E",
        "#D6F09E"
      ]
    };

    return (
      <View style={styles.container}>
        <AnimatedLinearGradient
          customColors={colorScheme.homemade}
          speed={1000}
        />
          <Text style={styles.welcome} onPress={this.onLogin}>
            Login
          </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cccccc"
  },
  welcome: {
    backgroundColor: 'transparent',
    fontSize: 50,
    fontFamily: "Noteworthy-Bold",
    margin: 10,
    color: "#505050"
  }
});
