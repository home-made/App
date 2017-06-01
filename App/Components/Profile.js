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
  Button
} from "native-base";
import { Actions, ActionConst } from "react-native-router-flux";
import { Grid, Row, Col } from "react-native-easy-grid";
import DishView from "./DishView";
import Review from "./Review";
import axios from "axios";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleReviewsPress = this.handleReviewsPress.bind(this);
    this.handleMenuPress = this.handleMenuPress.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleCheckout = this.handleCheckout.bind(this);
  }

  componentWillMount() {
    AsyncStorage.getItem('profile').then(profile => {

      let userId = JSON.parse(profile).userId;
      console.log("userId is ", userId)

      axios.get(`http://localhost:3000/user/${userId}`).then(user => {
        console.log("the user inside axiospost for profile.js is ", user);
        this.setState({
          user: user.data[0],
          isChef: user.data[0].isChef
        });

      }).catch(error => {
        console.log("Error inside axios post for Profile.js is ", error);
      })
    }).catch(error => {
      console.log("Error inside AsyncStorage for Profile.js is ", error);
    })

/*
  authId: String,
  firstName: String,
  lastName: String,
  bio: String,
  status: String,
  phoneNumber: String,
  likes: [Number],
  profileUrl: String,
  customerReviews: [],
  chefReviews: [],
  isChef: Boolean,
  location: { geo_lat: Number, geo_lng: Number, address: String },
  rating: Number
*/

/*
    let chef = this.props.getChef();
    this.setState({ chef: this.props.getChef(), cart: [] }, () => {
      let reviews = this.state.chef[0].chefReviews.map(curr => {
        return {
          userText: curr.reviewText,
          user: this.state.chef[2][
            this.state.chef[2]
              .map(o => {
                return o.authId;
              })
              .indexOf(curr.reviewerId)
          ]
        };
      });
      this.setState({ reviewers: reviews });
    });

*/

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


  /*

     var UserSchema = new Schema({
     authId: String,
     firstName: String,
     lastName: String,
     bio: String,
     status: String,
     phoneNumber: String,
     likes: [Number],
     profileUrl: String,
     customerReviews: [],
     chefReviews: [],
     isChef: Boolean,
     location: { geo_lat: Number, geo_lng: Number, address: String },
     rating: Number
   });


  */

  render() {
    return (
      <Container style={{ marginTop: 60 }}>
        <Content>
          <Card>
            <CardItem>

              <Body>
                <Text>{this.state.user.firstName ? this.state.user.firstName : ""}</Text>
                <Text note>{this.state.user.status ? this.state.user.status : ""}</Text>
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
                      uri: this.state.user.profileUrl ? 
                    }}
                  />
                </Row>
              </Body>
            </CardItem>
          </Card>
          <Row style={{ justifyContent: "center", alignItems: "center" }}>
            <Button onPress={this.handleReviewsPress}>
              <Text>Reviews</Text>
            </Button>
            <Text> </Text>
            <Button onPress={this.handleMenuPress}><Text>Menu</Text></Button>
          </Row>

          {this.state.menu
            ? this.state.chef[1].map((dish, idx) => {
                if (idx === this.state.chef[1].length - 1) {
                  return (
                    <View>
                      <DishView dish={dish} addToCart={this.handleAddToCart} />
                      {this.state.cart.length > 0 ? (<Container style={{alignItems:"center", marginBottom: -600}}><Content><Button success onPress={() => this.handleCheckout()}>
                        <Text> Checkout </Text>
                      </Button></Content></Container>) : (<Text></Text>)}
                    </View>
                  );
                } else {
                  return (
                    <DishView dish={dish} addToCart={this.handleAddToCart} />
                  );
                }
              })
            : <Text />}

          {this.state.reviews
            ? this.state.reviewers.map(review => {
                return <Review review={review} />;
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
