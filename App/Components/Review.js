import React, { Component } from "react";
import { StyleSheet, Text, Container, View, Card } from "react-native";
import { Grid, Row, Col } from "react-native-easy-grid";
import { Thumbnail, ListItem, Left, Body, Right } from "native-base";

export default class Review extends Component {
  constructor(props) {
    super();
  }

  render() {
    const styles = {
      reviewScore: {
        color: '#505050',
        fontFamily: 'Noteworthy-Bold',
        fontSize: 18,
        alignSelf: 'center',
        marginBottom: 15
      },
      review: {
        fontFamily: 'Noteworthy-Bold',
        fontSize: 15,
        marginBottom: 15,
      }
    }

    console.log("props inside Review.js are ", this.props)
    return (
      <ListItem avatar>
        <Body style={{alignContent: "center", alignItems: "center", justifyContent: "center"}}>
          <Text style={styles.reviewScore}>Review Score: {this.props.review.score}/5</Text>
          <Text style={styles.review} note>{this.props.review.reviewText}</Text>
        </Body>
      </ListItem>
    );
  }
}
