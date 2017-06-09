import React, { Component } from "react";
import { View, AsyncStorage, Alert, TextInput } from "react-native";
import axios from "axios";
import { Container, Content, List, Header, Text, Button } from "native-base";
import CheckOutItem from "./CheckOutItem.js";
import SocketIO from "socket.io-client";
import { Actions, ActionConst } from "react-native-router-flux";
var socket;
export default class Checkout extends Component {
  /*
      State inside Checkout.js is 
      cashTotal: 14
      chefId: "facebook|"
      customerId: "google-oauth2|"
      data: [array of dish documents]
      dishCounter: {obj}

      where cashTotal is the total dollar amt calculated in the checkout

      dishCounter obj has:
      {dishKey: {
        amount: 1
        cashDonation:7}
      }

      where amount is the number of times 
      the dish has been incremented

    */
  constructor(props) {
    super(props);
    this.state = {};
    this.incrementDishCount = this.incrementDishCount.bind(this);
    this.decrementDishCount = this.decrementDishCount.bind(this);
    this.deleteDish = this.deleteDish.bind(this);
    this.calculateTotal = this.calculateTotal.bind(this);
    this.submitOrder = this.submitOrder.bind(this);
    this.checkAgain = this.checkAgain.bind(this);
    
  }

  componentWillMount() {
    this.calculateTotal();

  }

  incrementDishCount(key) {
    var newDishCounter = this.state.dishCounter;
    var newCount = newDishCounter[key].amount;
    newDishCounter[key].amount = newCount + 1;

    this.setState({
      dishCounter: newDishCounter
    });

    this.calculateTotal();
  }

  decrementDishCount(key) {
    var newDishCounter = this.state.dishCounter;
    var newCount = newDishCounter[key].amount;
    newCount = newCount - 1;

    if (newCount <= 0) {
      newDishCounter[key].amount = 0;
      this.setState({ dishCounter: newDishCounter });
      this.calculateTotal();
    } else {
      newDishCounter[key].amount = newCount;
      this.setState({ dishCounter: newDishCounter });
      this.calculateTotal();
    }
  }

  deleteDish(key) {
    var total = this.state.cashTotal;
    var subtract;
    var newData = this.state.data.filter(dish => {
      return dish._id !== key;
    });
    var newDishCounter = this.state.dishCounter;
    subtract = newDishCounter[key].amount * newDishCounter[key].cashDonation;
    delete newDishCounter[key];
    this.setState({ dishCounter: newDishCounter }, () => { if(Object.keys(this.state.dishCounter).length === 0) {
      Actions.cuisines({ type: ActionConst.RESET });
    }});
    total -= subtract;

    this.setState({
      data: newData,
      cashTotal: total
    });
  }

  calculateTotal() {
    var dishCounter = this.state.dishCounter;
    var total = 0;

    for (var dishID in dishCounter) {
      var amount = dishCounter[dishID].amount;
      amount *= dishCounter[dishID].cashDonation;

      total += amount;
      amount = 0;
    }

    this.setState({
      cashTotal: total
    });
  }

  sendNotification() {
    return Alert.alert(
      "Order Submitted to Chef!",
      "Wait for a confirmation your order was accepted.",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
    );

  }

  submitOrder() {

    //where status: 0 means the order is pending approval
    var newOrder = {
      chefId: this.state.chefId,
      customerId: this.state.customerId,
      cart: this.state.dishCounter,
      status: 0,
      cashTotal: this.state.cashTotal,
      orderInstructions: this.state.orderInstructions
    };
    console.log("NEW ORDER IS", newOrder)
    this.props.sendOrderSocket(newOrder);

    this.sendNotification();
    let context = this;
    axios
      .post("http://homemadeapp.org:3000/orders", newOrder)
      .then(function(response) {
        console.log("New order inside Checkout.js was submitted to the database, response is: ", response);
        
        setTimeout( ()=> { context.checkAgain.call(null, response.data.customerId) }, 10000);
        
        Actions.userOrders({ type: ActionConst.RESET });
      })
      .catch(function(error) {
        console.log("The error message inside checkout post is ", error);
      });
  }
  checkAgain(customer) {
    let customerId = customer;
    axios.get("http://homemadeapp.org:3000/orders/" + customerId).then((orders) => {
      console.log("Orders inside Checkout.js checkAgain() are ", orders);

      if(orders.data[orders.data.length - 1].status === 0){
        axios.put("http://homemadeapp.org:3000/orders/", { _id: orders.data[orders.data.length - 1]._id, status: 3 } ).then((res) => {
          console.log("SUCCESSFULLY CANCELED", res.data);
        })
      }
    })
  }
  componentDidMount() {
    console.log("compont did mont start");
    let cart = this.props.fetchCart();
    let dishItems = {};
    let chefDishes = {};
    cart.data.map(dish => {
      dishItems[dish._id] = {
        dish: dish,
        amount: 1,
        cashDonation: dish.cashDonation
      };
      this.state.cashTotal += dish.cashDonation;
    });
    console.log("CART IS", cart);
    console.log("dishItems IS", dishItems);
    this.setState(cart);
    this.setState({
      dishCounter: dishItems
    });
  }

  render() {
    const styles = {
      container: {
        marginTop: 64
      },
      total: {
        fontFamily: 'Noteworthy-Bold',
        fontSize: 20,
        marginBottom: 10
      },
      submitButton: {
        fontFamily: 'Noteworthy-Bold',
        fontSize: 15
      }
    }

    console.log("render start");
    console.log("the state inside the checkout is ", this.state);
    if (!this.state.data) {
      return (
        <Container style={{marginTop: 63}}>
          <Header><Text>Checkout</Text></Header>
          <Content>
            <Text>Your shopping cart is empty!</Text>
          </Content>
        </Container>
      );
    } else {
      return (
        <Container style={styles.container}>
          <Content>
            <Text style={{textAlign: "center"}}>Special Requests/Notes for Chef</Text>
            <TextInput
            style={{
              fontSize: 18,
              marginLeft: "auto",
              marginRight: "auto",
              padding: 20,
              height: 150,
              borderColor: "gray",
              borderWidth: 2,
              width: 340,
              borderRadius: 30
            }}
            returnKeyType='done'
            placeholder='Special Requests?'
            onChangeText={orderInstructions => this.setState({ orderInstructions }, 
            () => console.log(this.state.orderInstructions))}
            multiline={true}
            maxLength={300}
          />
            <List style={{marginTop: 40}}>
              {this.state.data.map(orderItem => {
                return (
                  <CheckOutItem
                    key={orderItem._id}
                    dishCounter={this.state.dishCounter}
                    deleteDish={this.deleteDish}
                    incrementDishCount={this.incrementDishCount}
                    decrementDishCount={this.decrementDishCount}
                    submitOrder={this.submitOrder}
                    orderItem={orderItem}
                  />
                );
              })}
            </List>
            <Header>
              <Text style={styles.total}>Total: ${this.state.cashTotal}</Text>
            </Header>
            <Container style={{ alignItems: "center" }}>
              <Content>
                <Button
                  style={{ marginTop: 30, marginLeft: "auto", marginRight: "auto" }}
                  onPress={this.submitOrder}
                  success
                >
                  <Text style={styles.submitButton}>Submit Order</Text>
                </Button>

                
              </Content>
            </Container>
          </Content>

       
        </Container>
      );
    }
  }
}