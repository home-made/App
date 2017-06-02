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
import SetProfile from "../utils/SetProfile";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chefReviews: [],
      customerReviews: []
    };
    this.displayChefReviews = this.displayChefReviews.bind(this);
    this.displayCustomerReviews = this.displayCustomerReviews.bind(this);
  }

  displayChefReviews() {
    console.log("the chef reviews are ", this.state.chefReviews);
    var reviews = this.state.chefReviews;

    if (!this.state.chefReviews.length > 0) {
      return <Text />;
    } else {
      return (
        <Container>
          <Text>Your Reviews as a Chef</Text>
          {reviews.map(review => {
            return <Review review={review} />;
          })}
        </Container>
      );
    }
  }

  displayCustomerReviews() {
    console.log("the reviews are ", this.state.customerReviews);
    var reviews = this.state.customerReviews;

    if (!this.state.customerReviews.length > 0) {
      return <Text />;
    } else {
      return (
        <Container>
          <Text>Your Reviews as a Customer</Text>
          {reviews.map(review => {
            return <Review review={review} />;
          })}
        </Container>
      );
    }
  }

  componentWillMount() {
    let context = this;
    let userId;

    async function grabAuthId() {
      try {
        const profile = await AsyncStorage.getItem("profile");
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
    return (
      <Container style={{ marginTop: 60 }}>
        <Content>
          <Card>
            <CardItem>
              <Body>
                <Text>
                  Name:
                  {" "}
                  {!this.state.fullName != "n/a"
                    ? this.state.fullName
                    : this.state.firstName}
                </Text>
                <Text note>
                  Status:
                  {" "}
                  {!this.state.status
                    ? "No status at this time."
                    : this.state.status}
                </Text>
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
                      uri: !this.state.profileUrl
                        ? ""
                        : this.state.user.profileUrl
                    }}
                  />
                </Row>
              </Body>
            </CardItem>
          </Card>
        </Content>

        {this.displayCustomerReviews()}
        {this.displayChefReviews()}
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
