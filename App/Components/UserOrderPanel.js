import React, { Component } from "react";
import SocketIO from "socket.io-client";
import ActionButton from "react-native-circular-action-menu";
import Icon from 'react-native-vector-icons/Foundation';
import Icon2 from 'react-native-vector-icons/Entypo';

import {
  View,
  StyleSheet,
  ScrollView,
  AsyncStorage,
  RefreshControl,
  Image
} from "react-native";
import {
  Button,
  Text,
  Container,
  Content,
  Header,
  Left,
  Right
} from "native-base";
import Communications from "react-native-communications";
import { Actions } from "react-native-router-flux";
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
    socket = new SocketIO("http://homemadeapp.org:3000");
    socket.connect();
    socket.on("init", splash => {
      console.log(splash);
    });
    socket.on("chef", splash => {
      console.log("new", splash);
    });
    socket.on("message", res => {
      console.log(res);
    });
    async function getAuthID() {
      try {
        const data = await AsyncStorage.getItem("profile");
        if (data !== null && data !== undefined) {
          data = JSON.parse(data);
          console.log("DATA IS ", data);
          authID = data.userId;
        }
      } catch (err) {
        console.log("Error getting data: ", err);
      }
    }

    getAuthID()
      .then(() => {
        console.log("AUTHID IS", authID);
        axios
          .get("http://homemadeapp.org:3000/orders/" + authID)
          .then(orders => {
            let order = orders.data[orders.data.length - 1];
            console.log("ORDER IS", order);
            axios
              .get("http://homemadeapp.org:3000/user/" + order.chefId)
              .then(chefDetails => {
                console.log("CHEF DETAILS ARE", chefDetails);
                this.setState(
                  {
                    order,
                    chefLocation: chefDetails.data[0].location,
                    phone: chefDetails.data[0].phoneNumber,
                    chefDetails: chefDetails.data[0]
                  },
                  () => {
                    console.log(this.state.order);
                    this.sendOrderSocket(this.state.order);
                  }
                );
              });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  _onRefresh = () => {
    this.componentWillMount();
  };
  sendOrderSocket(order) {
    console.log(socket.id);
    // var orders = setInterval(() =>{
    //   getChefOrder = (tweet) =>{
    //     socket.volatile.emit('chef',this.state.order)
    //   }
    // },100)
    // let orders = this.state.order
    socket.emit("neworder", order.chefId);
  }
  render() {
    console.log(this.state, this.props);
    if (!this.state.order) return <ScrollView />;
    else {
      console.log("THERE IS AN ORDER");
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
            <Image
              style={{
                width: 150,
                height: 150,
                marginTop: -50,
                marginBottom: 50,
                borderRadius: 75
              }}
              source={{
                uri: this.state.chefDetails.profileUrl
              }}
            />
            <Text>Ordered from: {this.state.chefDetails.firstName}</Text>
            <Text>Order placed: {this.state.order.date}</Text>
            {this.state.order.status === 0
              ? <Text>Order Status: Pending</Text>
              : null}

            {this.state.order.status === 1
              ? <View><Text>Order Status: Accepted</Text></View>
              : null}
            {this.state.order.status === 2
              ? <Text>Order Status: Complete</Text>
              : null}

            <Content>
              {this.state.order.status === 1
                ? <View>
                    <Button
                      style={{ marginTop: 10 }}
                      onPress={() => {
                        this.props.setChefLocationAndPhoneNumber(
                          this.state.chefLocation,
                          this.state.phone
                        );
                      }}
                    >
                      <Text>Get Directions</Text>
                    </Button>
                  </View>
                : null}

              <View style={{flexDirection: 'row'}}>
              {this.state.order.status === 1
                ? <View style={{ flex: 1, marginTop: 70}}>
                    <ActionButton
                      style={{}}
                      icon={<Icon name="telephone"  size={30} style={{alignItems: "center", color: "white"}} />}
                      buttonColor="#02E550"
                      onPress={() =>
                        Communications.phonecall(this.state.phone, true)
                      }
                    />

      
                  </View>
                : null}
                
                {this.state.order.status === 1
                ? <View style={{ flex: 1, marginTop: 70}}>
                    <ActionButton
                      style={{justifyContent: "flex-end"}}
                      icon={<Icon2 name="message"  size={30} style={{alignItems: "center", color: "white"}} />}
                      buttonColor="#02E550"
                    />
                  </View>
                : null}
                </View>

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
                : <Text />}
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
