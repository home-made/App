import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
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
    const styles = {
      item: {
        alignSelf: 'center',
        fontFamily: 'MarkerFelt-Thin',
        fontSize: 22,
        color: '#505050'
      },
      aqGroup: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-around'
      },
      amtQnty: {
        fontFamily: 'Noteworthy-Bold',
        fontSize: 14
      },
      quantity: {
        fontFamily: 'Noteworthy-Bold',
        fontSize: 14
      },
      buttons: {
        marginTop: 10,
        justifyContent: 'space-around',
        flexDirection: 'row',
      },
      buttonText: {
        fontFamily: 'Noteworthy-Bold',
        fontSize: 15
      }
    }

    console.log("dishcounter", this.dishCounter);
    console.log("the checkout item is ", this.props)
    return (
      <ListItem>
        <Thumbnail large square source={{ uri: this.uri }} />
        <Body>
          <Text style={styles.item}>{this.itemName}</Text>
          <Row
            style={{ flexDirection: 'column' }}
          >

            <View style={styles.aqGroup}>
              <Text style={styles.amtQnty}>
                Amount: $
                {this.dishCounter[this.id].cashDonation}
              </Text>
              <Text style={styles.amtQnty}>
                Quantity:
                {" "}
                {this.dishCounter[this.id].amount}
              </Text>
            </View>

            <View style={styles.buttons}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button onPress={this.handleIncrement} light small>
                  <Text style={styles.buttonText}>+</Text>
                </Button>

                <Button onPress={this.handleDecrement} light small>
                  <Text style={styles.buttonText}>-</Text>
                </Button>
              </View>
              <View>
                <Button onPress={this.handleDelete} danger small>
                  <Text style={styles.buttonText}>Delete</Text>
                </Button>
              </View>
            </View>

          </Row>
        </Body>
      </ListItem>
    );
  }
}
