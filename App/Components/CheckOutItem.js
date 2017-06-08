import React, { Component } from "react";
import StyleSheet from "react-native";
import { ListItem, Thumbnail, Text, Body, Button } from "native-base";
import { Grid, Row, Col } from "react-native-easy-grid";

export default class CheckOutItem extends Component {
  constructor(props) {
    super(props);

    this.id = this.props.orderItem._id;
    this.uri = this.props.orderItem.dishImages[0];
    this.itemName = this.props.orderItem.name;
    this.dishCounter = this.props.dishCounter;

    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleIncrement() {
    if(this.props.dishCounter[this.id].amount < this.props.orderItem.quantity) {
      this.props.incrementDishCount(this.id);
    }
    
  }

  handleDecrement() {
    this.props.decrementDishCount(this.id);
  }

  handleDelete() {
    this.props.deleteDish(this.id);
  }

  render() {
    console.log("dishcounter", this.dishCounter);
    console.log("the checkout item is ", this.props)
    return (
      <ListItem>
        <Thumbnail square size={80} source={{ uri: this.uri }} />
        <Body>
          <Text>{this.itemName}</Text>
          <Row
            style={{ justifyContent: "space-around", alignItems: "flex-start" }}
          >
            <Text>
              Amt: $
              {this.dishCounter[this.id].cashDonation}
              {" "}
              Qty:
              {" "}
              {this.dishCounter[this.id].amount}
            </Text>

            <Button onPress={this.handleIncrement} light small>
              <Text>+</Text>
            </Button>

            <Button onPress={this.handleDecrement} light small>
              <Text>-</Text>
            </Button>

            <Button onPress={this.handleDelete} danger small>
              <Text>Delete</Text>
            </Button>
          </Row>
        </Body>
      </ListItem>
    );
  }
}
