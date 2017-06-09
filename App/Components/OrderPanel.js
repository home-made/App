import React, { Component } from "react";
import { StyleSheet, View, AsyncStorage, ScrollView } from "react-native";
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
  ListItem,
  Body,
  Thumbnail,
  Text
} from "native-base";
import axios from "axios";
import { Actions } from "react-native-router-flux";
import moment from "moment";
import socket from "../Socket/Socket";

export default class OrderPanel extends Component {
  constructor() {
    super();
    this.state = {};
    this.returnRow = this.returnRow.bind(this);
  }
  returnRow(data) {
    var dateAndTime = moment(data.date).format("LLLL");
    // console.log("DATA IS", data);

    return (
      <ListItem
        onPress={() => {
          this.props.updateOrderSocket(data);
          console.log("CHEF VIEW ON CLICK", this.state.chefView)
          if(this.props.chefView){
            Actions.orderView(data);
          } else {
            Actions.userOrders(data);
          }
          
          {
            /*setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);*/
          }
        }}
      >
        <Thumbnail square size={80} source={{uri: data.customer.profileUrl}} />

        <Body>
          <Text style={{ marginLeft: 10 }}>
            {data.customer.firstName}{"\n"}
            <Text note>{dateAndTime}{"\n"}Cash Donation ${data.cashTotal}</Text>
          </Text>
        </Body>
      </ListItem>
    );
  }

  componentWillReceiveProps() {
    console.log("IN ORDER PANEL COMPONENT WILL RECEIVE PROPS");
    this.componentWillMount();
  }

  componentWillMount() {
    let authID;
    let user;
    var customerInit = () => {
      axios
          .get("http://homemadeapp.org:3000/orders/0/user/" + authID)
          .then(pending => {
            this.setState({ pendingCustomers: pending.data[1] }, () =>
              this.setState({ pending: pending.data[0] })
            );
            axios
              .get("http://homemadeapp.org:3000/orders/1/user/" + authID)
              .then(accepted => {
                this.setState({ acceptedCustomers: accepted.data[1] }, () =>
                  this.setState({ accepted: accepted.data[0] }, () => ()=> console.log('accepted orders is', this.state.accepted))
                );
                axios
                  .get("http://homemadeapp.org:3000/orders/2/user/" + authID)
                  .then(complete => {
                    console.log("COMPLETE DATA IS", complete.data);
                    this.setState(
                      { completeCustomers: complete.data[1] },
                      () => {
                        this.setState({ complete: complete.data[0] }, () => {});
                      }
                    );
                  });
              });
          });
    }
    var chefInit = () => {
      axios
          .get("http://homemadeapp.org:3000/orders/0/chef/" + authID)
          .then(pending => {
            this.setState({ pendingCustomers: pending.data[1] }, () =>
              this.setState({ pending: pending.data[0] })
            );
            axios
              .get("http://homemadeapp.org:3000/orders/1/chef/" + authID)
              .then(accepted => {
                this.setState({ acceptedCustomers: accepted.data[1] }, () =>
                  this.setState({ accepted: accepted.data[0] }, () => ()=> console.log('accepted orders is', this.state.accepted))
                );
                // console.log('call http://homemadeapp.org:3000/orders/2/' + authID)
                axios
                  .get("http://homemadeapp.org:3000/orders/2/chef/" + authID)
                  .then(complete => {
                    console.log("COMPLETE DATA IS", complete.data);
                    this.setState(
                      { completeCustomers: complete.data[1] },
                      () => {
                        this.setState({ complete: complete.data[0] }, () => {});
                      }
                    );
                  });
              });
          });
    }
    console.log("CHEF ORDER PANEL WILL MOUNT");
    async function getAuthID() {
      try {
        const data = await AsyncStorage.getItem("profile");
        if (data !== null && data !== undefined) {
          authID = JSON.parse(data).userId;
          console.log("JSON PARSE", JSON.parse(data));
          user = JSON.parse(data);
          console.log(authID);
        }
      } catch (err) {
        console.log("Error getting data: ", err);
      }
    }
    // console.log("USER IS", user);
       getAuthID().then(() => {
        if(this.props.chefView){
         chefInit()
        }
        else {
         customerInit();
        }
      });

  }

  render() {
    var pendingOrders = [];
    var acceptedOrders = [];
    var completeOrders = [];
    console.log("STATE AND PROPS IN ORDERPANEL", this.state, this.props);
    return (
      <Container>
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
                  pendingOrders.unshift(this.returnRow(item));
                })}
          <ScrollView>
            <List style={{ marginTop: 10 }} dataArray={this.state.pending}>
              {pendingOrders}
            </List>
          </ScrollView>
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
                  acceptedOrders.unshift(this.returnRow(item));
                })}
          <ScrollView>
            <List style={{ marginTop: 10 }} dataArray={this.state.accepted}>
              {acceptedOrders}
            </List>
          </ScrollView>
          </Tab>

          <Tab heading={<TabHeading><Text>Complete</Text></TabHeading>}>
            {!this.state.complete
              ? <Text />
              : this.state.complete.forEach(item => {
                  for (var customer in this.state.completeCustomers) {
                    if (
                      this.state.completeCustomers[customer].authId ===
                      item.customerId
                    )
                      item.customer = this.state.completeCustomers[customer];
                  }
                  completeOrders.unshift(this.returnRow(item));
                })}
            <ScrollView>
              <List style={{ marginTop: 10 }} dataArray={this.state.complete}>
                {completeOrders}
              </List>
            </ScrollView>
          </Tab>
        </Tabs>
      </Container>
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
