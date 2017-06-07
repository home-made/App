import React, { Component } from "react";
import { StyleSheet, View, Image } from "react-native";
import {
  Button,
  Container,
  Text,
  Content,
  Card,
  Body,
  CardItem
} from "native-base";
import { Grid, Row, Col } from "react-native-easy-grid";
import { Actions, ActionConst } from "react-native-router-flux";
import axios from "axios";
import moment from "moment";
export default class OrderView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleAccept = this.handleAccept.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
  }

  componentWillMount() {
    let dishes = [];
    console.log("proganda", this.props);

    for (var key in this.props.cart) {
      dishes.push(this.props.cart[key]);
    }
    this.setState({ dishes }, () =>
      console.log("STATE.DISHES", this.state.dishes)
    );
  }

  handleAccept() {
    let request = {
      chefId: this.props.chefId,
      date: this.props.date,
      _id: this.props._id,
      status: 1
    };
    console.log("accept looks like", request);
    axios.put("http://homemadeapp.org:3000/orders", request).then(res => {
      console.log("RESPONSE IS", res.data);
      Actions.orders({ type: ActionConst.RESET });
    });
  }

  handleDecline() {
    let request = {
      chefId: this.props.chefId,
      date: this.props.date,
      _id: this.props._id,
      status: 3
    };
    axios
      .put("http://homemadeapp.org:3000/orders", request)
      .then(() => Actions.orders({ type: ActionConst.RESET }));
  }

  handleComplete() {
    console.log("INSIDE HANDLE COMPLETE");
    let request = {
      chefId: this.props.chefId,
      date: this.props.date,
      _id: this.props._id,
      status: 2
    };
    axios.put("http://homemadeapp.org:3000/orders", request).then(res => {
      console.log("COMPLETED ORDER:", res.data);
      Actions.orders({ type: ActionConst.RESET });
    });
  }

  render() {
    console.log("STATE AND PROPS IN ORDER VIEW", this.state, this.props);
    return (
      <Container>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            style={{
              width: 150,
              height: 150,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 100,
              marginBottom: 10,
              borderRadius: 75
            }}
            source={{
              uri: this.props.customer.profileUrl
            }}
          />
        </View>
        {this.props.status === 0
          ? <Row
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >

              {this.props.status === 0
                ? <Button onPress={this.handleDecline}>
                    <Text>Decline</Text>
                  </Button>
                : null}

              {this.props.status === 0
                ? <Button
                    style={{ marginLeft: 10 }}
                    onPress={this.handleAccept}
                  >
                    <Text>Accept</Text>
                  </Button>
                : null}

            </Row>
          : null}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",

          }}
        >

          <View
            style={{
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {this.props.status === 1
              ? <Button
                  onPress={() => {
                    this.handleComplete();
                  }}
                >
                  <Text>Order Complete</Text>
                </Button>
              : null}
            {this.props.status === 2
              ? <Button
          
                  onPress={() =>
                    Actions.feedback({
                      chefId: this.props.chefId,
                      customerId: this.props.customerId,
                      date: this.props.date,
                      _id: this.props._id
                    })}
                >
                  <Text>Leave Feedback</Text>
                </Button>
              : null}
            <Button
              style={{ marginVertical: 10 }}
              onPress={() => {
                Actions.profile({ chef: this.props.customer });
              }}
            >
              <Text>Customer Profile</Text>
            </Button>

          </View>
          <Text>Your order from: {this.props.customer.firstName} </Text>
          <Text>Placed at: {moment(this.props.date).format("LLLL")}</Text>
        </View>
        {this.props.status !== 2 ? this.state.dishes.map(dish => {
          return (
            <Card style={{ marginTop: 40 }}>
              <CardItem>
                <Body>
                  <Text>
                    {dish.dish.name}
                  </Text>
                  <Text>
                    {dish.dish.description}
                  </Text>
                  <Text>
                    Amount: {dish.amount}
                  </Text>
                </Body>
              </CardItem>
            </Card>
          );
        }): null } 
      </Container>
    );
  }
}
