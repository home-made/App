import React, { Component } from "react";
import { StyleSheet, Text, Container, View, Card } from "react-native";
import { Grid, Row, Col } from "react-native-easy-grid";
import { Thumbnail, ListItem, Left, Body, Right } from "native-base";

export default class Review extends Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <ListItem avatar>
        <Body>
          <Text>Review Score: {this.props.review.score}</Text>
          <Text note>{this.props.review.reviewText}</Text>
        </Body>
      </ListItem>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});
