import React, { Component } from "react";
import { View, StyleSheet, AsyncStorage } from "react-native";
import {
  Container,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Body,
  Left,
  Right
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
        marginTop: 20,
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
      <Container style={styles.actionButtonIcon}>
        <Content style={{ marginTop: 20 }}>
          <ListItem avatar onPress={this.cuisines}>
            <Body>
              <Text>Cuisines</Text>
            </Body>
            <Right>
              <Text note>🍕</Text>
            </Right>
          </ListItem>
          <ListItem avatar onPress={this.profile}>
            <Body>
              <Text>Profile</Text>
            </Body>
            <Right>
              <Text note />
            </Right>
          </ListItem>
          <ListItem avatar onPress={this.chefMap}>
            <Body>
              <Text>Map</Text>
            </Body>
            <Right>
              <Text note />
            </Right>
          </ListItem>
          <ListItem avatar onPress={this.checkout}>
            <Body>
              <Text>Checkout</Text>
            </Body>
            <Right>
              <Text note />
            </Right>
          </ListItem>
          <ListItem avatar onPress={this.edit}>
            <Body>
              <Text>Edit Profile</Text>
            </Body>
            <Right>
              <Text note />
            </Right>
          </ListItem>
          <ListItem avatar onPress={this.orders}>
            <Body>
              <Text style={styles.entries}>Orders</Text>
            </Body>
            <Right>
              <Text note />
            </Right>
          </ListItem>
            <ListItem avatar onPress={this.dishcreate}>
            <Body>
              <Text>Create Dish</Text>
            </Body>
          </ListItem>
          <ListItem avatar onPress={this.logout}>
            <Body>
              <Text>Log Out</Text>
            </Body>
            <Right>
              <Text note>LO</Text>
            </Right>
          </ListItem>
          <ListItem avatar>
            <Body>
              <Text style={styles.entries}>Chef Mode</Text>
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
    fontSize: 20,
    height: 22,
    color: "white"
  }
});
