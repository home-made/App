import React, { Component } from "react";
import { StyleSheet, View, Image, AsyncStorage } from "react-native";
import { Container, Text, Content, Card, CardItem, Left, Body, Button } from "native-base";
import { Actions, ActionConst } from "react-native-router-flux";
import { Grid, Row, Col } from "react-native-easy-grid";
import DishView from "./DishView";
import Review from "./Review";
import axios from "axios";
import SetProfile from '../utils/SetProfile';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleReviewsPress = this.handleReviewsPress.bind(this);
    this.handleMenuPress = this.handleMenuPress.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleCheckout = this.handleCheckout.bind(this);
    this.displayDishView = this.displayDishView.bind(this);
  }

  

  handleReviewsPress() {
    console.log(this.state.reviewers);
    // let
    this.setState({ reviews: true, menu: false }, console.log(this.state));
  }

  handleMenuPress() {
    this.setState({ reviews: false, menu: true }, console.log(this.state));
  }

  handleAddToCart(e) {
    var cart = [];
    cart = this.state.cart;
    cart.push(e);
    this.setState({ cart: cart }, console.log("CART IS", this.state.cart));
  }

  handleCheckout(){
    let customerId;
    async function checkStorage() {
      try {
        const data = await AsyncStorage.getItem('profile');
        if (data !== null && data !== undefined) {
          console.log('async data: ', data);
          customerId = JSON.parse(data).userId;
        }
      } catch (err) {
        console.log('Error getting data: ', err);
      }
    }
    checkStorage()
      .then(() => {
        this.setState({checkout: {
          data: this.state.cart,
          chefId: this.state.chef[0].authId,
          customerId: customerId,
        }},() =>{ 
          console.log(this.state.checkout);
          this.props.setCart(this.state.checkout)
          Actions.checkout({type:ActionConst.RESET});
        })
      });
  }
  
  displayDishView(){

  }


             /*
              user: user.data[0],
              authId: user.data[0].authId,
              chefReviews: user.data[0].chefReviews,
              firstName: user.data[0].firstName,
              lastName: user.data[0].lastName,
              fullName: fullName,
              status: user.data[0].status,
              isChef: user.data[0].isChef,
              likes: user.data[0].likes,
              _id: user.data[0]._id
              menu: activeDishes
              
            */

  componentWillMount() {
    
    let context = this;
    let userId;

    async function grabAuthId() {
      try {
        const profile = await AsyncStorage.getItem('profile');
        if (profile !== null && profile !== undefined) {
          userId = JSON.parse(profile).userId;
          console.log(JSON.parse(profile).userId);
          console.log(userId);

          SetProfile(context, userId);

        }
      } catch (err) {
        console.log("Error getting profile: ", err);
      }
    }
    grabAuthId();

  }

  render() {
    {console.log("the state is ", this.state)}
    return (
      <Container style={{ marginTop: 60 }}>
        <Content>
          <Card>
            <CardItem>
              <Body>
                <Text>Name: {!this.state.fullName != "n/a" ?  this.state.fullName :  this.state.firstName}</Text>
                <Text note>Status: {!this.state.status ? "No status at this time." :  this.state.status}</Text>
              </Body>
            </CardItem>

            <CardItem>
              <Body>
                <Row style={{ justifyContent: "center", alignItems: "center" }}>

                  <Image style={{ 
                         width: 120, 
                         height: 120, 
                         justifyContent: "center", 
                         alignItems:  "center", 
                         borderRadius: 60 }} 
                         source={{ uri: !this.state.profileUrl ? "" : this.state.user.profileUrl }} />
                </Row>
              </Body>
            </CardItem>
          </Card>

            <Row style={{ justifyContent: "center", alignItems: "center" }}>
              <Button onPress={this.handleReviewsPress}>
                <Text>Reviews</Text>
              </Button>
              
              {/*<Button onPress={this.handleMenuPress}>
                <Text>Menu</Text>
              </Button> */}
            </Row>

            {this.state.chefReviews
            ? this.state.chefReviews.map(review => {
                console.log("the review is ", review)
                {/*return <Review review={review} />;*/}
              })
            : <Text />}




          
        </Content>
      </Container>
    );

  }

}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});