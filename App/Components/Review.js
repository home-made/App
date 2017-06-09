import React, { Component } from "react";
import { StyleSheet, Container, View, Card } from "react-native";
import { Grid, Row, Col } from "react-native-easy-grid";
import { Thumbnail, ListItem, Left, Body, Right,Text } from "native-base";

export default class Review extends Component {
  constructor(props) {
    super();
  }

  render() {
    const styles = {
      reviewScore: {
        color: '#E05050',
        fontFamily: 'Noteworthy-Bold',
        fontSize: 18,
        alignSelf: 'center',
        marginBottom: 15
      },
      review: {
        fontFamily: 'Noteworthy-Bold',
        fontSize: 15,
        marginBottom: 15,
      },
       cardName: {
        fontSize: 18,
        color: '#E05050',
        fontFamily: 'Noteworthy-Bold'
      },
      cardDesc: {

        fontSize: 17,
        fontFamily: 'Noteworthy-light'
      }
    }

    console.log("props inside Review.js are ", this.props)
    return (
      <ListItem>

          <Thumbnail square source={{uri: this.props.review.user.profileUrl}}/>
        <Body >
          <Text style={styles.cardName}>{this.props.review.user.firstName}</Text>

          <Text style={styles.cardDesc} note>{this.props.review.userText}</Text>
        </Body>
      </ListItem>
    );
  }
}
