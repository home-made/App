import React, { Component } from "react";
import { StyleSheet, ScrollView, AsyncStorage } from "react-native";
import { Button, Text, Container } from "native-base";
import SocketIO from "socket.io-client";
import axios from "axios";
var socket;
export default class UserOrderPanel extends Component {
  constructor() {
    super();
    this.state = {order: null};
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
          console.log("DATA IS ", data);
          authID = data.userId;
        }
      } catch (err) {
        console.log("Error getting data: ", err);
      }
    }

    getAuthID().then( () => {
      console.log("AUTHID IS", authID)
      axios.get("http://localhost:3000/orders/" + authID).then(orders => {
        let order = orders.data[orders.data.length - 1];
        this.setState({ order: order }, () => {
          console.log(this.state.order)
          socket.emit("join", this.state.order);
        });
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }

  render() {

    if (!this.state.order) return (<ScrollView ></ScrollView >)
    else{
    return (
      <Container style={{alignItems: "center", alignContent: "center", justifyContent: "center", marginTop: 100}}>
      <ScrollView >
        <Text>Order placed: {this.state.order.date}</Text>
        {this.state.order.status === 0 ? (<Text>Order Status: Pending</Text>) : <Text>Order Status: Accepted</Text>}
      </ScrollView>
      </Container>
    ) }}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});
