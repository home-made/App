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
import axios from "axios";

export default class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      score: null
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

  render() {
    return (
      <Container>
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
        />
        <View style={{ alignItems: "center" }}>
          {this.state.score !== null
            ? <Text>{this.state.score}/10</Text>
            : <Text />}
        </View>

        <Slider
          minimumValue={0}
          maximumValue={10}
          onValueChange={score =>
            this.setState({ score: Math.floor(score) }, () =>
              console.log(this.state.score)
            )}
        />
        <View style={{ alignItems: "center" }}>
          <Text>Rating</Text>
        </View>

        <Button success onPress={this.submitFeedback}>
          <Text>Submit Feedback</Text>
        </Button>

      </Container>
    );
  }
}
