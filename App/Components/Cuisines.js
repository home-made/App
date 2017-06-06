import React, { Component } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Container, Content, List, ListItem, Text } from "native-base";

export default class Cuisines extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    let genres;
    this.setState({ genres: this.props.getStyles() }, () =>
      console.log(this.state.genres)
    );
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
