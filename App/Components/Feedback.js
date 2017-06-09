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
      console.log("http://homemadeapp.org:3000/reviews/0/" + this.props.chefId)
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
            { text: "OK", onPress: () => Actions.orders({ chefView: true, type: ActionConst.RESET }) }
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
    const styles = {
      container: {
        flex: 1
      },
      textInputView: {
        flex: 1,
        margin: 13
      },
      textInput: {
        fontSize: 20,
        margin: 5,
        marginTop: 80,
        padding: 20,
        paddingTop: 10,
        height: 200,
        borderColor: "gray",
        borderWidth: 2,
        borderRadius: 30
      },
      starsContainerView: {
        flex: 0.2,
        justifyContent: 'center',
        marginLeft: 50,
        marginRight: 50
      },
      starsCountView: {
        alignItems: "center"
      },
      starsCountText: {
        fontFamily: 'MarkerFelt-Wide',
        fontSize: 35,
        textAlign: 'center',
        color: '#505050'
      },
      buttonView: {
        flex: 0.8,
        justifyContent: 'center',
        alignSelf: "center"
      }
    }

    return (
      <View style={styles.container}>
        <Content style={styles.textInputView}>
          <TextInput
            style={styles.textInput}
            placeholder='Leave a feedback!'
            onChangeText={text =>
              this.setState({ text }, () => console.log(this.state.text))}
            multiline={true}
            returnKeyType='done'
            maxLength={300}
            keyboardType="default"
          />
        </Content>
        
        <View style={styles.starsContainerView}>
          <StarRating
            disabled={false}
            maxStars={5}
            rating={this.state.score}
            selectedStar={(rating) => this.onStarRatingPress(rating)}
            starColor='#F5F548'
            emptyStarColor='#ECECEC'
          />
          <View style={styles.starsCountView}>
            <Text style={styles.starsCountText}>{this.state.score}/5</Text>
          </View>
        </View>

        <View
          style={styles.buttonView}>
          <Button
            rounded transparent bordered dark
            onPress={this.submitFeedback}
          >
            <Text>Submit Feedback</Text>
          </Button>
        </View>

      </View>
    );
  }
}
