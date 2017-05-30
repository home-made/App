import React, { Component } from "react";
import { Image, View, StyleSheet, AsyncStorage } from "react-native";
import {
  Container,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Body,
  Left,
  Right,
  Icon
} from "native-base";
import { Actions, ActionConst } from "react-native-router-flux";
import { Switch } from "react-native-switch";

export default class NavBar extends Component {
  cuisines() {
    Actions.cuisines({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  chefList() {
    Actions.chefList({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  profile() {
    Actions.profile({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  chefMap() {
    Actions.chefMap({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  checkout() {
    Actions.checkout({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  edit() {
    Actions.edit({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  dishcreate() {
    Actions.dishcreate({type:ActionConst.RESET});
  }

  orders() {
    let chefView;
    async function getChefViewBool() {
      try {
        const data = await AsyncStorage.getItem("profile");
        if (data !== null && data !== undefined) {
          data = JSON.parse(data);
          chefView = data.chefView;
        }
      } catch (err) {
        console.log("Error getting data: ", err);
      }
    }
    getChefViewBool().then(() => {
      console.log("chefView is", chefView);
      if (chefView) {
        Actions.orders({ type: ActionConst.RESET });
      } else {
        Actions.userOrders({ type: ActionConst.RESET });
      }
    });

    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  chefform() {
    Actions.chefform({type:ActionConst.RESET});
    setTimeout(() => Actions.refresh({ key: 'drawer', open: false }), 0)
  }

  logout() {
    Actions.homepage({ type: ActionConst.RESET });
    async function clearStorage() {
      try {
        await AsyncStorage.multiRemove(
          ["profile", "token", "isAuthenticated"],
          () => {
            console.log("Storage cleared!");
          }
        );
      } catch (err) {
        console.log("Error clearing storage: ", err);
      }
    }
    clearStorage();
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  async toggleChefMode() {
    try {
      const profile = await AsyncStorage.getItem("profile");

      profile = JSON.parse(profile);
      profile.chefView = !profile.chefView;
      profile = JSON.stringify(profile);
      if (profile !== null && profile !== undefined) {
        await AsyncStorage.setItem("profile", profile);
      }
    } catch (err) {
      console.log("Error getting data: ", err);
    }
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

          <ListItem avatar onPress={this.dishcreate}>
            <Body>
              <Text>Create Dish</Text>
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
          <ListItem icon onPress={this.orders} style={styles.content}>
            <Left>
              <Icon name='ios-filing' />
            </Left>
            <Body>
              <Text>Orders</Text>
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
          <ListItem avatar>
            <Body>
              <Text>Chef Mode</Text>
              <Text />
              <Switch
                value={true}
                onValueChange={this.toggleChefMode}
                disabled={false}
                backgroundActive={"green"}
                backgroundInactive={"gray"}
                circleActiveColor={"white"}
                circleInActiveColor={"white"}
              />
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
