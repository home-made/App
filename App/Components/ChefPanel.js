import React, { Component } from "react";
import { Router, Scene, Actions, ActionConst } from "react-native-router-flux";
import { StyleSheet, View, ScrollView, AsyncStorage } from "react-native";
import {
  Container,
  Header,
  Tabs,
  Tab,
  Tab1,
  Tab2,
  Tab3,
  TabHeading,
  List,
  Body,
  Text,
  Thumbnail,
  ListItem
} from "native-base";
import axios from "react-native-axios";
export default class ChefPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    async function getAuthID() {
      try {
        const data = await AsyncStorage.getItem("profile");
        if (data !== null && data !== undefined) {
          authID = JSON.parse(data).userId;
          console.log(authID);
        }
      } catch (err) {
        console.log("Error getting data: ", err);
      }
    }

    getAuthID().then(() => {
      axios.get("http://localhost:3000/dish/0/" + authID).then(inactive => {
        this.setState({ inactive: inactive.data }, () =>
          console.log("INACTIVE DISHES ARE ", this.state.inactive)
        );
        axios.get("http://localhost:3000/dish/1/" + authID).then(active => {
          this.setState({ active: active.data }, () =>
            console.log("ACTIVE DISHES ARE ", this.state.active)
          );
        });
      });
    });
  }
  returnRow(data) {
    console.log("DATA IS", data)
    return (
      <ListItem
        onPress={() => {
          this.props.setDish(data);
          Actions.dishedit();
        }}
      >
        <Thumbnail square size={80} source={{ uri: data.dishImages[0] }} />
        <Body>
          <Text style={{ marginLeft: 10 }}>
            {data.name}
          </Text>
          <Text note>
            Quantity: {data.quantity}
          </Text>
        </Body>
      </ListItem>
    );
  }

  render() {
    var inactiveOrders = [];
    var activeOrders = [];
    return (
      <ScrollView>
        <Header hasTabs />
        <Tabs>
          <Tab heading={<TabHeading><Text>Inactive</Text></TabHeading>}>
            {!this.state.inactive
              ? <Text />
              : this.state.inactive.forEach(item =>
                  inactiveOrders.push(this.returnRow(item))
                )}
            <List style={{ marginTop: 10 }} dataArray={this.state.inactive}>
              {inactiveOrders}
            </List>
          </Tab>

          <Tab heading={<TabHeading><Text>Active</Text></TabHeading>}>
            {!this.state.active
              ? <Text />
              : this.state.active.forEach(item =>
                  activeOrders.push(this.returnRow(item))
                )}
            <List style={{ marginTop: 10 }} dataArray={this.state.active}>
              {activeOrders}
            </List>
          </Tab>
        </Tabs>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});
