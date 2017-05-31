import React, { Component } from "react";
import { Image, View, StyleSheet, AsyncStorage } from "react-native";
import { Container, Content, List, ListItem, Thumbnail, Text, Body, Left, Right, Icon } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';
import axios from 'axios';

export default class NavBar extends Component {

  cuisines() {
    Actions.cuisines({type:ActionConst.RESET});
    setTimeout(() => Actions.refresh({ key: 'drawer', open: false }), 0)
  }

  profile() {
    Actions.profile({type:ActionConst.RESET});
    setTimeout(() => Actions.refresh({ key: 'drawer', open: false }), 0)
  }
  chefMap() {
    Actions.chefMap({type:ActionConst.RESET});
    setTimeout(() => Actions.refresh({ key: 'drawer', open: false }), 0)
  }
  
  edit() {
    Actions.edit({type:ActionConst.RESET});
    setTimeout(() => Actions.refresh({ key: 'drawer', open: false }), 0)
  }

  chefform() {
    Actions.chefform({type:ActionConst.RESET});
    setTimeout(() => Actions.refresh({ key: 'drawer', open: false }), 0)
  }

  logout() {
    Actions.homepage({type:ActionConst.RESET});
    async function clearStorage() {
      try {
        await AsyncStorage.multiRemove(['profile', 'token', 'isAuthenticated'], () => {
          console.log('Storage cleared!');
        })
      } catch (err) {
        console.log('Error clearing storage: ', err);
      }
    }
    clearStorage();

    axios.get('https://stzy.auth0.com/v2/logout?federated')
      .then((res) => console.log(res))

    setTimeout(() => Actions.refresh({ key: 'drawer', open: false }), 0)
  }

  render() {
    const styles = {
      content: {
        marginTop: 22,
        justifyContent: 'center',
        alignItems: 'center'
      },
      backgroundImage: {
        position: 'absolute',
        resizeMode: 'cover'
      },
      entries: {
        fontSize: 22
      }
    }
    return (
      <Container style={{}}>

        <Image source={require('./img/turquoise-top-gradient-background.jpg')} style={styles.backgroundImage} />

        <View style={{ flex: .2, justifyContent: 'center', flexDirection: 'column' }}>
          <Text style={{ textAlign: 'center', fontSize: 25 }}>HOMEMADE BITCHES</Text>
        </View>

        <Content>
          <ListItem icon onPress={this.cuisines} style={styles.content}>
            <Left>
              <Icon name='ios-pizza' />
            </Left>
            <Body>
                <Text style={styles.entries}>Cuisines</Text>
            </Body>
          </ListItem>
          <ListItem icon onPress={this.profile} style={styles.content}>
            <Left>
              <Icon name='ios-contact' />
            </Left>
            <Body>
              <Text style={styles.entries}>Profile</Text>
            </Body>
          </ListItem>
          <ListItem icon onPress={this.chefMap} style={styles.content}>
            <Left>
              <Icon name='ios-map' />
            </Left>
            <Body>
              <Text style={styles.entries}>Map</Text>
            </Body>
          </ListItem>
          <ListItem icon onPress={this.edit} style={styles.content}>
            <Left>
              <Icon name='ios-create' />
            </Left>
            <Body>
              <Text style={styles.entries}>Edit Profile</Text>
            </Body>
          </ListItem>
          <ListItem icon onPress={this.chefform} style={styles.content}>
            <Left>
              <Icon name='ios-star' />
            </Left>
            <Body>
              <Text style={styles.entries}>Be A Chef!</Text>
            </Body>
          </ListItem>
          <ListItem icon onPress={this.logout} style={styles.content}>
            <Left>
              <Icon name='ios-exit' />
            </Left>
            <Body>
              <Text style={styles.entries}>Log Out</Text>
            </Body>
          </ListItem>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 30,
    height: 1000,
    color: "white"
  },
  content: {
    marginTop: 30
  }
});
