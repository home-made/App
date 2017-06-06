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
import axios from "axios";
var socket;
var moment = require('moment');




export default class UserOrderPanel extends Component {
  constructor() {
    super();
    this.state = {
      refreshing: false,
      order: null
    };
    this._onRefresh = this._onRefresh.bind(this);
    this.displayOrderStatus = this.displayOrderStatus.bind(this);
  }

  componentWillMount() {
    console.log("IN USER ORDER PANEL WILL MOUNT");
    let authID;
    socket = new SocketIO("http://localhost:3000");
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

    var context = this;

    getAuthID()
      .then(() => {
        console.log("AUTHID IS", authID);
        axios
          .get("http://localhost:3000/orders/" + authID)
          .then(orders => {
            console.log("orders inside UserOrderPanel is ", orders)
            
            let order = orders.data[orders.data.length - 1];
            
            console.log("ORDER IS", order)
            
            axios
              .get("http://localhost:3000/user/" + order.chefId)
              .then(chefDetails => {
                console.log("CHEF DETAILS ARE", chefDetails);

                var chefData = context.props.getChef();
                var chefName = `${chefData[0].firstName} ${chefData[0].lastName}`;

                this.setState(
                  {
                    order,
                    chefName,
                    chefLocation: chefDetails.data[0].location,
                    phone: chefDetails.data[0].phoneNumber
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

  displayOrderStatus(){
    if (this.state.order.status === 0)
      return(
        <Content style={{ marginTop: 10 }}>
          <Text>Your current order status is: Pending</Text>
        </Content>
      ) 
        
    else if (this.state.order.status === 1) {
      return(
        <Content style={{ marginTop: 20 }}>
          <Text>Your current order status is: Accepted</Text>
        </Content>
      )    

    } else if (this.state.order.status === 2) {
      return(
        <Content style={{ marginTop: 20 }}>
          <Text>Your current order status is: Complete</Text>
        </Content>
      )

    } else if (this.state.order.status === 3) {
      return (
        <Content style={{ marginTop: 20, marginRight: 5, marginLeft: 5 }}>
          <Text>We're sorry, your order did not go through.</Text>
          <Text>Please go back and place another order.</Text>
        </Content>
      )

    } else {
      return null;
    }

  }

  render() {
    console.log("state inside UserOrderPanel is ", this.state);

    if (!this.state.order) return <ScrollView />;
    else {
      console.log("THERE IS AN ORDER", this.state);
      console.log("");
      console.log("the chef is ", this.props.getChef())
      var orderDate = moment(this.state.order.date).format('LLLL');
      console.log("orderDate is ", orderDate);
      

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

            
            <Text>Your order with {this.state.chefName}</Text> 
            <Text>was placed on:</Text>
            <Text>{orderDate}</Text>
            
            {this.displayOrderStatus()}

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
