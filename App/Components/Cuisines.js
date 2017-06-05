import React, { Component } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Container, Content, List, ListItem, Text } from "native-base";

export default class Cuisines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genres: "All Cuisines,American,Barbecue,Burgers,Chinese,Indian,Italian,Japanese,Korean,Mediterranean,Mexican,Pizza,Sandwiches,Sushi,Thai,Vegetarian,Vietnamese,American,Ethiopian,Other".split(
      ",")
    }
  }

  render() {

    return (
      <ScrollView style={{ alignSelf: "stretch" }}>
        <List style={{ marginTop: 60 }}>
          {this.state.genres.map((genre, index) => {
            return (
              <ListItem
                onPress={() => this.props.setCuisineType(genre)}
                key={index}
              >
                <Text>
                  {genre}
                </Text>
              </ListItem>
            );
          })}
        </List>
      </ScrollView>
    );
  }
}
