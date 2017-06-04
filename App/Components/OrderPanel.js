import React, { Component } from "react";
import { StyleSheet, Text, View, AsyncStorage, ScrollView} from "react-native";
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
  ListItem
} from "native-base";
import axios from "axios";
import { Actions } from "react-native-router-flux";
import SocketIO from "socket.io-client";
var socket = new SocketIO("localhost:3000");
export default class OrderPanel extends Component {
  constructor() {
    super();
    this.state = {};
    this.returnRow = this.returnRow.bind(this);
  }

  returnRow(data) {
    return (
      <ListItem onPress={() => Actions.orderView(data)}>
        <Text style={{ marginLeft: 10 }}>
          Placed at: {data.date.slice(11, 16)}{"\n"}
          Cash total: ${data.cashTotal}
        </Text>
      </ListItem>
    );
  }

  componentWillMount() {
    let authID;
    console.log("CHEF ORDER PANEL WILL MOUNT");
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
      axios.get("http://localhost:3000/orders/0/" + authID).then(pending => {
        this.setState({ pending: pending.data[0] }, () =>
          console.log("PENDING ORDERS ARE ", this.state.pending)
        );
        axios.get("http://localhost:3000/orders/1/" + authID).then(accepted => {
          this.setState({ accepted: accepted.data[0] }, () =>
            console.log("ACCEPTED ORDERS ARE ", this.state.accepted)
          );
          axios
            .get("http://localhost:3000/orders/2/" + authID)
            .then(complete => {
              this.setState({ complete: complete.data[0] }, () =>
                console.log("COMPLETE ORDERS ARE ", this.state.complete)
              );
            });
        });
      });
    });
  }

  render() {
    var pendingOrders = [];
    var acceptedOrders = [];
    var completeOrders = [];
    console.log(this.state.pending, this.state.accepted, this.state.complete);
    return (

      <ScrollView>
        <Header hasTabs />
        <Tabs >
          <Tab onPress={this.render} heading={<TabHeading><Text>Pending</Text></TabHeading>}>
            {!this.state.pending
              ? <Text />
              : this.state.pending.forEach(item =>
                  pendingOrders.push(this.returnRow(item))
                )}
            <List style={{ marginTop: 10 }} dataArray={this.state.pending}>
              {pendingOrders}
            </List>
          </Tab>

          <Tab heading={<TabHeading><Text>Confirmed</Text></TabHeading>}>
            {!this.state.accepted
              ? <Text />
              : this.state.accepted.forEach(item =>
                  acceptedOrders.push(this.returnRow(item))
                )}
            <List style={{ marginTop: 10 }} dataArray={this.state.accepted}>
              {acceptedOrders}
            </List>
          </Tab>

          <Tab heading={<TabHeading><Text>Complete</Text></TabHeading>}>
            {!this.state.complete
              ? <Text />
              : this.state.complete.forEach(item =>
                  completeOrders.push(this.returnRow(item))
                )}
            <List style={{ marginTop: 10 }} dataArray={this.state.complete}>
              {completeOrders}
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
