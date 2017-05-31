import React, { Component } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Container, Content, List, ListItem, Text } from "native-base";

export default class ChefPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView style={{ alignSelf: "stretch" }}>
        <Text>ChefPanel</Text>
      </ScrollView>
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
