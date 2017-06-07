import React, { Component } from "react";
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from "react-native";
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
import moment from "moment";
var socket = new SocketIO("homemadeapp.org:3000");

export default class OrderPanel extends Component {
  constructor() {
    super();
    this.state = {};
    this.returnRow = this.returnRow.bind(this);
  }

  returnRow(data) {
    var dateAndTime = moment(data.date).format('LLLL');
    // console.log("DATA IS", data);
    return (
      <ListItem
        onPress={() => {
          Actions.orderView(data);
          {/*setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);*/}
        }}
      >
        <Text style={{ marginLeft: 10 }}>
          Placed at: {dateAndTime}{"\n"}
          Cash total: ${data.cashTotal}
        </Text>
      </ListItem>
    );
  }

  componentWillReceiveProps() {
    console.log("IN ORDER PANEL COMPONENT WILL RECEIVE PROPS");
    this.componentWillMount();
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
      axios
        .get("http://homemadeapp.org:3000/orders/0/" + authID)
        .then(pending => {
          this.setState({ pendingCustomers: pending.data[1] }, () =>
            this.setState({ pending: pending.data[0] })
          );
          axios
            .get("http://homemadeapp.org:3000/orders/1/" + authID)
            .then(accepted => {
              this.setState({ acceptedCustomers: accepted.data[1] }, () =>
                this.setState({ accepted: accepted.data[0] }, () => {})
              );
              axios
                .get("http://homemadeapp.org:3000/orders/2/" + authID)
                .then(complete => {
                  console.log("COMPLETE DATA IS", complete.data)
                  this.setState({ completeCustomers: complete.data[1] }, () =>{

                  
                    // console.log(this.state.completedCustomers)
                    this.setState({ complete: complete.data[0] }, () => {})
                  });
                });
            });
        });
    });
  }

  render() {
    var pendingOrders = [];
    var acceptedOrders = [];
    var completeOrders = [];
    console.log("STATE AND PROPS IN ORDERPANEL", this.state, this.props)
    return (
      <ScrollView>
        <Header hasTabs />
        <Tabs>
          <Tab
            onPress={this.render}
            heading={<TabHeading><Text>Pending</Text></TabHeading>}
          >
            {!this.state.pending
              ? <Text />
              : this.state.pending.forEach(item => {
                  for (var customer in this.state.pendingCustomers) {
                    if (
                      this.state.pendingCustomers[customer].authId ===
                      item.customerId
                    )
                      item.customer = this.state.pendingCustomers[customer];
                  }
                  pendingOrders.push(this.returnRow(item));
                })}
            <List style={{ marginTop: 10 }} dataArray={this.state.pending}>
              {pendingOrders}
            </List>
          </Tab>

          <Tab heading={<TabHeading><Text>Confirmed</Text></TabHeading>}>
            {!this.state.accepted
              ? <Text />
              : this.state.accepted.forEach(item => {
                  for (var customer in this.state.acceptedCustomers) {
                    if (
                      this.state.acceptedCustomers[customer].authId ===
                      item.customerId
                    )
                      item.customer = this.state.acceptedCustomers[customer];
                  }
                  acceptedOrders.push(this.returnRow(item));
                })}
            <List style={{ marginTop: 10 }} dataArray={this.state.accepted}>
              {acceptedOrders}
            </List>
          </Tab>

          <Tab heading={<TabHeading><Text>Complete</Text></TabHeading>}>
            {!this.state.complete
              ? <Text />
              : this.state.complete.forEach(item => {
                  console.log("COMPLETE CUSTOMERS ARE", this.state.completeCustomers)
                  for (var customer in this.state.completeCustomers) {
                    console.log("IN FOR LOOP", this.state.completeCustomers[customer] )
                    if (
                      this.state.completeCustomers[customer].authId ===
                      item.customerId
                    )
                      item.customer = this.state.completeCustomers[customer];
                      console.log("CUSTOMER IS", item.customer);
                  }
                  completeOrders.push(this.returnRow(item));
                })}
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
