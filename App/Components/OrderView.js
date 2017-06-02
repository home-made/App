import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
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
    axios
      .put('http://localhost:3000/orders', request)
      .then(() => Actions.orders());
  }

 handleDecline() {
    let request = {
      chefId: this.props.chefId,
      date: this.props.date,
      _id: this.props._id,
      status: 3
    };
    axios
      .put("http://localhost:3000/orders", request)
      .then(() => Actions.orders({ type: ActionConst.RESET }));
  }

  handleComplete() {
    let request = {
      chefId: this.props.chefId,
      date: this.props.date,
      _id: this.props._id,
      status: 2
    };
    axios
      .put("http://localhost:3000/orders", request)
      .then(() => Actions.orders({ type: ActionConst.RESET }));

  }

  render() {
    return (
      <Container>
        <Row
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 100
          }}
        >
          {this.props.status === 2
            ? <Button
                onPress={() =>
                  Actions.feedback({
                    chefId: this.props.chefId,
                    customerId: this.props.customerId
                  })}
              >
                <Text>Leave Feedback</Text>
              </Button>
            : null}

          {this.props.status === 0
            ? <Button onPress={this.handleDecline}><Text>Decline</Text></Button>
            : null}

          {this.props.status === 0
            ? <Button onPress={this.handleAccept}><Text>Accept</Text></Button>
            : null}

          {this.props.status === 1
            ? <Button onPress={this.handleComplete}>
                <Text>Order Complete</Text>
              </Button>
            : null}

        </Row>
        {this.state.dishes.map(dish => {
          return (
            <Card style={{ marginTop: -200 }}>
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
        })}
      </Container>
    );
  }
}
