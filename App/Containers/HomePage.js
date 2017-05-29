import React, { Component } from "react";
import { AsyncStorage, View, Image, Text, StyleSheet, TouchableHighlight, TouchableOpacity, ActivityIndicator } from "react-native";
import { Actions } from "react-native-router-flux";

import Promise from 'bluebird';
import Auth0Lock from 'react-native-lock';

export default class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.lock = new Auth0Lock({
      clientId: "Rp7ThYPPRNHrSGUaLOv_Ub307zwDb_VR",
      domain: "stzy.auth0.com",
      useBrowser: true,
    });

    this.lock.show = Promise.promisify(this.lock.show, {multiArgs: true});
    this.lock.show.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  componentDidMount() {
    this.checkStorage();  
  }

  async checkStorage() {
    try {
      const data = await AsyncStorage.multiGet(['profile', 'token', 'isAuthenticated'])
        if (data !== null && data !== undefined) {
          console.log('async data: ', data);
          if (data[2][1] === 'true') {
            Actions.drawer();
          }
        }
    } catch (err) {
      console.log('Error getting data: ', err);
    }
  }

  onLogin() {
    this.lock.show({
      // connections: ["touchid"]
      closeable: true
    }, (err, profile, token) => {
      if (err) {
        console.log(err);
      } else {
      
        token = JSON.stringify(token);
        profile = JSON.stringify(profile);
        async function setStorage() {
          try {
            await AsyncStorage.multiSet([['profile', profile], ['token', token], ['isAuthenticated', 'true']], (err) => err ? console.log('ERROR: ', err) : console.log('Info set!'));
            Actions.drawer();
          } catch (err) {
            console.log('Error setting data: ', err);
          }
        }
        setStorage();
      }
    })
  }

  showDrawer() {
    console.log('OPEN');
    Actions.refresh({ key: 'drawerChildrenWrapper', open: value => !value });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('./img/turquoise-top-gradient-background.jpg')} style={styles.backgroundImage} />
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
    position: 'absolute',
    resizeMode: 'cover'
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
