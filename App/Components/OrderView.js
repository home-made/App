import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Container, Text, Content, Card, Body, CardItem} from "native-base";
import { Grid, Row, Col } from "react-native-easy-grid";
import axios from "axios";

export default class OrderView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleAccept = this.handleAccept.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
  }

  componentWillMount() {
    let dishes = [];
    for (var key in this.props.cart) {
      dishes.push(this.props.cart[key]);
    }
    this.setState({dishes}, () => console.log(this.state.dishes));
  }

  handleAccept() {
    console.log("IN HANDLE ACCEPT, props are ", this.props);
    let request = {
      chefId: this.props.chefId,
      date: this.props.date,
      status: 1
    }
    axios.put("http://localhost:3000/orders", request).then((res) => console.log(res));
  }

  handleDecline() {
    console.log("IN HANDLE DECLINE, props are ", this.props);
    let request = {
      chefId: this.props.chefId,
      date: this.props.date,
      status: 3
    }
    axios.put("http://localhost:3000/orders", request).then((res) => console.log(res));
  }

  render() {
    console.log("PROPS IN ORDERVIEW", this.props);
    if (this.props.status === 0){
      return (
        <Container>
          <Row style={{justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
          <Button onPress={this.handleDecline}><Text>Decline</Text></Button>
          <Text> </Text> 
          <Button onPress={this.handleAccept}><Text>Accept</Text></Button>
          </Row>
          {this.state.dishes.map((dish) => {
            return (
            <Card style={{marginTop: -200}}>
              <CardItem>
                <Body>
                  <Text>
                      {dish.dish.description}
                  </Text>
                  <Text>
                      Amount: {dish.amount}
                  </Text>
                </Body>
              </CardItem>
              </Card>)
          })}
        </Container>
      )
    } else {
      return (
        <Container style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5FCFF"}}>
          <Text></Text>
        </Container>
      )
    } 
  }
}

