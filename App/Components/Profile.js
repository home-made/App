import React, { Component } from "react";
import { StyleSheet, View, Image, AsyncStorage } from "react-native";
import {
  Container,
  Text,
  Content,
  Card,
  CardItem,
  Left,
  Body,
  Button,
  ListItem,
} from "native-base";
import { Actions, ActionConst } from "react-native-router-flux";
import { Grid, Row, Col } from "react-native-easy-grid";
import DishViewCard from "./DishViewCard";
import Review from "./Review";
import Icon from "react-native-vector-icons/Entypo";
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.displayCheckout = this.displayCheckout.bind(this);
    this.handleReviewsPress = this.handleReviewsPress.bind(this);
    this.handleMenuPress = this.handleMenuPress.bind(this);
    this.toggleReviews = this.toggleReviews.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleCheckout = this.handleCheckout.bind(this);
    this.returnStars = this.returnStars.bind(this);
  }

  componentWillMount() {
    let chef = this.props.getChef();

    console.log("the chef inside Profile.js of componentWillMount is ", chef)
    this.setState({ chef: this.props.getChef(), cart: [] }, () => {
      
      let scoresArray = [];
      let numOfReviews = this.state.chef[0].chefReviews.length;

      
      let reviews = this.state.chef[0].chefReviews.map(curr => {

        scoresArray.push(curr.score);

        return {
          userText: curr.reviewText,
          user: this.state.chef[2][
            this.state.chef[2]
              .map(o => {
                return o.authId;
              })
              .indexOf(curr.reviewerId)
          ],
          score: curr.score
        };
      });


      let avgScore = scoresArray.reduce((a,b) => a + b);
      avgScore = Math.round(avgScore / numOfReviews);
      this.setState({ reviewers: reviews, avgScore });
    });
  }

  displayCheckout(){
    if (this.state.cart.length > 0) {
      return (
            <Button
              success
              onPress={() => this.handleCheckout()}
            >
              <Text> Checkout </Text>
            </Button>
      )
    } else {
      return <Text />
    }                        
  }

  handleReviewsPress() {
    console.log(this.state.reviewers);
    // let
    this.setState({ reviews: true, menu: false }, console.log(this.state));
  }

  handleMenuPress() {
    this.setState({ reviews: false, menu: true }, console.log(this.state));
  }

  toggleReviews(){
    console.log("Reviews inside Profile.js are ", this.state.reviewers);
    if (this.state.reviewers.length > 0) {
     return this.state.reviewers.map(review => {
        return <Review review={review} />;
      });
    } else {
      return (<Text note> Sorry no reviews available at this time </Text>
      )
    }
  }

  toggleMenu(){
    console.log("Menu inside Profile.js is ", this.state.chef);
    if (this.state.menu) {   
      return this.state.chef[1].map((dish, idx) => {
        if (idx === this.state.chef[1].length - 1) {
          return (
            <DishViewCard dish={dish} addToCart={this.handleAddToCart} />
          )
        } else {
          return (
            <DishViewCard dish={dish} addToCart={this.handleAddToCart} />
          )
        }
      }); 
    } else {
      return <Text />
    }
  }

  handleAddToCart(e) {
    var cart = [];
    cart = this.state.cart;
    cart.push(e);
    this.setState({ cart: cart }, console.log("CART IS", this.state.cart));
  }

  handleCheckout() {
    let customerId;
    async function checkStorage() {
      try {
        const data = await AsyncStorage.getItem("profile");
        if (data !== null && data !== undefined) {
          console.log("async data: ", data);
          customerId = JSON.parse(data).userId;
        }
      } catch (err) {
        console.log("Error getting data: ", err);
      }
    }
    checkStorage().then(() => {
      this.setState(
        {
          checkout: {
            data: this.state.cart,
            chefId: this.state.chef[0].authId,
            customerId: customerId
          }
        },
        () => {
          console.log(this.state.checkout);
          this.props.setCart(this.state.checkout);
          Actions.checkout({ type: ActionConst.RESET });
        }
      );
    });
  }

  returnRow(dish){
    return (
      <Text> {dish.name} </Text>
    ) 
  }

  returnStars() {
      var stars = []
      for(var i = 0; i <= this.state.avgScore; i++) {
        stars.push(<Icon name="star" />)
      } 
      return stars;
  }

  render() {
    {console.log("the state inside Profile.js is ", this.state)}
    let dishes = [];
    let stars = this.returnStars();
    return (
      <Container style={{ marginTop: 60 }}>
        <Content>
          <Card>
            <CardItem>

              <Body>
                <Text>{this.state.chef[0].firstName} {this.state.chef[0].lastName}</Text>
                <Text note>{this.state.chef[0].status}</Text>
                <Text note>Average Chef Score: {stars.map(star => {
                  return star;
                })}</Text>
              </Body>

            </CardItem>
            <CardItem>
              <Body>
                <Row style={{ justifyContent: "center", alignItems: "center" }}>
                  <Image
                    style={{
                      width: 120,
                      height: 120,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 60
                    }}
                    source={{
                      uri: this.state.chef[0].profileUrl
                    }}
                  />
                </Row>
              </Body>
            </CardItem>
          </Card>
          <Row style={{  alignItems: 'center', justifyContent: 'center'}}>
            <Button style={{marginRight: 10}} onPress={this.handleReviewsPress}><Text>Reviews</Text></Button>
            <Button style={{marginRight: 10}} onPress={this.handleMenuPress}><Text>Menu</Text></Button>
            {this.displayCheckout()}
          </Row>

          {this.state.reviews ? this.toggleReviews() : <Text />}
          {this.state.menu ? this.toggleMenu() : <Text />}
          
        </Content>
      </Container>
    );
  }
}