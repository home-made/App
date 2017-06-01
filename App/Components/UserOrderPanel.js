import React, { Component } from "react";
import { StyleSheet, ScrollView, AsyncStorage, RefreshControl} from "react-native";
import { Button, Text, Container, Content, Header, Left, Icon, Right } from "native-base";
import { Actions } from "react-native-router-flux";
import FontAwesome, { Icons } from "react-native-fontawesome";
import axios from "axios";

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
        console.log("AUTHID IS", authID);
        axios
          .get("http://localhost:3000/orders/" + authID)
          .then(orders => {
            let order = orders.data[orders.data.length - 1];
            this.setState({ order: order }, () =>
              console.log(this.state.order)
            );
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  _onRefresh = () => {
    this.componentWillMount();
  }

  render() {
        console.log("IN RENDER");
    if (!this.state.order) return <ScrollView />;
    else {
      return (
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center",
            marginTop: 150
          }}
          refreshControl={
          <RefreshControl

            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
            tintColor="#ff0000"
            title="Loading..."
            titleColor="black"
            colors={['#ff0000', '#00ff00', '#0000ff']}
            progressBackgroundColor="#ffff00"
          />
        }
        >
 
          <Text>Order placed: {this.state.order.date}</Text>
          {this.state.order.status === 0
            ? <Text>Order Status: Pending</Text>
            : <Text>Order Status: Accepted</Text>}
          <Content>
            {this.state.order.status !== 0
              ? <View>
                  <Button
                    style={{ marginTop: 10 }}
                    onPress={() => Actions.feedback(this.state.order)}
                  >
                    <Text>Leave Feedback</Text>
                  </Button>
                </View>
              : <Text />}
          </Content>


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
