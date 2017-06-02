import React, { Component } from "react";
import SocketIO from "socket.io-client";
import {
  View,
  StyleSheet,
  ScrollView,
  AsyncStorage,
  RefreshControl
} from "react-native";
import {
  Button,
  Text,
  Container,
  Content,
  Header,
  Left,
  Icon,
  Right
} from "native-base";

import { Actions } from "react-native-router-flux";
import FontAwesome, { Icons } from "react-native-fontawesome";
import axios from "axios";
var socket;
export default class UserOrderPanel extends Component {
  constructor() {
    super();
    this.state = {
      refreshing: false,
      order: null
    };
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentWillMount() {
    console.log("IN USER ORDER PANEL WILL MOUNT");
    let authID;
    socket = new SocketIO("localhost:3000");
    socket.connect();
      console.log('b4id is',socket.id)

    socket.on("connect", () => {
      console.log('id is',socket.id)
      socket.on("fresh", message => {
        console.log(message);
        console.log('send heem')
      });
    });

    async function getAuthID() {
      try {
        const data = await AsyncStorage.getItem("profile");
        if (data !== null && data !== undefined) {
          data = JSON.parse(data);
          console.log("DATA INSIDE USER ORDER PANEL IS ", data);
          authID = data.userId;
        }
      } catch (err) {
        console.log("Error getting data: ", err);
      }
    }

    getAuthID()
      .then(() => {
        axios
          .get("http://localhost:3000/orders/" + authID)
          .then(orders => {
            let order = orders.data[orders.data.length - 1];
            axios.get("http://localhost:3000/user/" + order.chefId).then(chefDetails => {
              console.log("CHEF DETAILS ARE", chefDetails)
              this.setState({ order, chefLocation: chefDetails.data[0].location, phone: chefDetails.data[0].phoneNumber});
            })
            
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));


  }

  _onRefresh = () => {
    this.componentWillMount();
  };

  render() {
    if (!this.state.order) return <ScrollView />;
    else {
      return (
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            marginTop: 70
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="black"
              colors={["#ff0000", "#00ff00", "#0000ff"]}
              progressBackgroundColor="#ffff00"
            />
          }
        >
          <Text>Pull Down to Refresh</Text>
          <View style={{ alignItems: "center", marginTop: 150 }}>
            <Text>Order placed: {this.state.order.date}</Text>
            {this.state.order.status === 0
              ? <Text>Order Status: Pending</Text>
              : <Text>Order Status: Accepted</Text>}
            <Content>
              {this.state.order.status === 1
                ? <View>
                    <Button
                      style={{ marginTop: 10 }}
                      onPress={() => {
                        this.props.setChefLocationAndPhoneNumber(this.state.chefLocation, this.state.phone);
                      }}
                    >
                      <Text>Get Directions</Text>
                    </Button>
                  </View>
                : null}

              {this.state.order.status === 2
                ? <View>
                    <Button
                      style={{ marginTop: 10 }}
                      onPress={() =>
                        Actions.feedback(this.state.order, {
                          leavingChefReview: true
                        })}
                    >
                      <Text>Leave Feedback</Text>
                    </Button>
                  </View>
                : null}
            </Content>
          </View>

        </ScrollView>
      );
    }
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
