import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  AsyncStorage,
  ScrollView
} from "react-native";
import {
  Container,
  Text,
  Content,
  Card,
  CardItem,
  Left,
  Body,
  Button,
  H3
} from "native-base";
import Icon from "react-native-vector-icons/Entypo";
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
      customerReviews: [],
      showChefReviews: false,
      showCustomerReviews: true
    };
    this.handleReviews = this.handleReviews.bind(this);
  }

  handleReviews() {
    var allReviews = this.state.chefReviews.concat(this.state.customerReviews);

    if (allReviews.length === 0) {
      return <Text>No reviews available at this time.</Text>;
    } else {
      return (
        <Content
          contentContainerStyle={{
            marginRight: 10,
            marginLeft: 10,
            marginTop: 10
          }}
        >
          <H3 style={{ color: "#505050" }}>Reviews</H3>
          {allReviews.map(review => {
            return <Review review={review} />;
          })}
        </Content>
      );
    }
  }

  componentWillMount() {
    let context = this;
    if (!this.props.profile) {
      async function grabAuthId() {
        try {
          const profile = await AsyncStorage.getItem("profile");
          if (profile !== null && profile !== undefined) {
            userId = JSON.parse(profile).userId;
            parsedProfile = JSON.parse(profile);
            var authId = parsedProfile.userId;
            var fullName = parsedProfile.name;

            axios
              .get(`http://homemadeapp.org:3000/user/${authId}`)
              .then(user => {
                context.setState({
                  fullName: user.data[0].firstName,
                  authId: authId,
                  userPic: user.data[0].profileUrl,
                  user: user.data[0],
                  chefReviews: user.data[0].chefReviews,
                  customerReviews: user.data[0].customerReviews,
                  status: user.data[0].status
                });
              })
              .catch(error => {
                console.log(
                  "Error inside axios get user for UserProfile.js is ",
                  error
                );
              });
          }
        } catch (err) {
          console.log("Error getting profile: ", err);
        }
      }
      grabAuthId();
    } else {
      axios
        .get(`http://homemadeapp.org:3000/user/${this.props.profile.authId}`)
        .then(user => {
          this.setState({
            fullName: user.data[0].firstName,
            authId: user.data[0].authId,
            userPic: user.data[0].profileUrl,
            user: user.data[0],
            chefReviews: user.data[0].chefReviews,
            customerReviews: user.data[0].customerReviews,
            status: user.data[0].status
          },()=>{
            let scoresArray = [];
            let numOfReviews = this.state.user.chefReviews.length;

            let reviews = this.state.user.chefReviews.map(curr => {
              scoresArray.push(curr.score);
              
            });
            console.log('score is',scoresArray)

            let avgScore = 0;
            if (scoresArray.length > 0) {
               avgScore = scoresArray.reduce((a, b) => a + b);
               avgScore = (avgScore / numOfReviews).toPrecision(2);
           }
           console.log(avgScore)
           
            this.setState({ avgScore });
          // });
          });
        })
        .catch(error => {
          console.log(
            "Error inside axios get user for UserProfile.js is ",
            error
          );
        });
    }
  }
  returnStar() {
    return <Icon style={{ color: "#EFEF54", fontSize: 18 }} name="star" />;
  }
  render() {
    const styles = {
      text: {
        color: "#505050",
        alignSelf: "center"
      },
      container: {
        marginTop: 60
      },
      cardName: {
        alignSelf: "center",
        fontSize: 18,
        color: "#505050",
        fontFamily: "Noteworthy-Bold"
      },
      cardDesc: {
        alignSelf: "center",
        fontSize: 14,
        fontFamily: "Noteworthy-light"
      },
      cardRating: {
        alignSelf: "center",
        fontSize: 14,
        fontFamily: "Noteworthy-light"
      },
      cardRow: {
        justifyContent: "center",
        alignSelf: "center"
      },
      cardImage: {
        width: 120,
        height: 120,
        justifyContent: "center",
        borderRadius: 60
      }
    };

    return (
      <Container>
        <Container style={styles.container}>
          <Content>
            <Card style={{ flex: 0.3, marginTop: -150, justifyContent: "center" }}>
              <CardItem>
                <Body style={{ justifyContent: "center", alignItems: "center" }}>
                  <Text style={styles.cardName}>
                    {!this.state.fullName ? "name unknown" : this.state.fullName}
                  </Text>
                  <Text style={styles.cardDesc} note>
                    {!this.state.status
                      ? "No status at this time."
                      : this.state.status}
                  </Text>
                   {this.state.avgScore > 0
                  ? <Text style={styles.cardRating} note>
                      {this.returnStar()} {this.state.avgScore}
                    </Text>
                  : <Text note>No Reviews Available</Text>}
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Row style={{ justifyContent: "center", alignSelf: "center" }}>
                    <Image
                      style={{
                        position: "absolute",
                        width: 120,
                        height: 120,
                        justifyContent: "center",
                        borderRadius: 60
                      }}
                      source={{
                        uri: !this.state.userPic ? "" : this.state.userPic
                      }}
                    />
                  </Row>
                </Body>
              </CardItem>
            </Card>

            {this.handleReviews()}

          </Content>
        </Container>
      </Container>
    );
  }
}