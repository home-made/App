import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Slider,
  Alert
} from "react-native";
import { Container, Content, Button, Text } from "native-base";
import { Actions, ActionConst } from "react-native-router-flux";
import StarRating from 'react-native-star-rating';
import axios from "axios";

export default class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      score: 0
    };
    this.submitFeedback = this.submitFeedback.bind(this);
  }

  submitFeedback() {
    console.log("PROPS ARE:", this.props);

    if (this.props.leavingChefReview) {
      let review = {
        reviewText: this.state.text,
        reviewerId: this.props.customerId,
        score: this.state.score
      };
      axios
        .post("http://homemadeapp.org:3000/reviews/0/" + this.props.chefId, review)
        .then(() =>

          Alert.alert("Your feedback has been submitted!", "Thank you.", [
            { text: "OK", onPress: () => Actions.cuisines({ type: ActionConst.RESET }) }
          ])
        );
    } else {
      let review = {
        reviewText: this.state.text,
        reviewerId: this.props.chefId,
        score: this.state.score
      };
      axios
        .post(
          "http://homemadeapp.org:3000/reviews/1/" + this.props.customerId,
          review
        )
        .then(res => {
          console.log(res);
          Alert.alert("Your feedback has been submitted!", "Thank you.", [
            { text: "OK", onPress: () => Actions.orders({ type: ActionConst.RESET }) }
          ]);
        });
    }
  }

  onStarRatingPress(rating) {
    console.log(rating);
    this.setState({
      score: rating
    });
  }

  render() {
    return (
      <Container>
        <Content>
        <TextInput
          style={{
            fontSize: 20,
            margin: 5,
            marginTop: 80,
            padding: 10,
            height: 200,
            borderColor: "gray",
            borderWidth: 2
          }}
          onChangeText={text =>
            this.setState({ text }, () => console.log(this.state.text))}
          multiline={true}
          maxLength={300}
          keyboardType="default"
        />
        
        <View style={{flex: 1, justifyContent: 'center', marginLeft: 50, marginRight: 50}}>
          <StarRating
            disabled={false}
            maxStars={5}
            rating={this.state.score}
            selectedStar={(rating) => this.onStarRatingPress(rating)}
            starColor='#F5F548'
            emptyStarColor='#ECECEC'
          />
          <View style={{ alignItems: "center" }}>
            <Text>{this.state.score}/5</Text>
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignSelf: "center" }}>
          <Button success onPress={this.submitFeedback}>
            <Text>Submit Feedback</Text>
          </Button>
        </View>
        </Content>

      </Container>
    );
  }
}
