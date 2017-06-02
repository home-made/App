import React, { Component } from "react";
import { Image, StyleSheet, View, ScrollView } from "react-native";
import axios from "axios";
import { Container, Content, Text, List, ListItem } from "native-base";

export default class ChefList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.setState({ chefs: this.props.fetchChefs() });
  }

  render() {
    let chefs = this.state.chefs;

    if (chefs.length === 0) {
      console.log("inside the if block for ChefList and chefs is ", chefs)
      return (
        <Container style={{ marginTop: 70 }}>
          <Content>
            <Text note>Whoops! There are currently no chefs available for this cuisine!</Text>
          </Content>
        </Container>
      )
    } else {
      return (
        <Container>
          <Content>
            <List
              style={{ marginTop: 60 }}
              dataArray={chefs}
              renderRow={chef => (
                <ListItem
                  onPress={() => {
                    console.log("CHEF IS", chef)
                    this.props.setChef(chef);
                  }}
                >
                  <Image
                    style={{ width: 70, height: 70 }}
                    source={{
                      uri: chef.profileUrl
                    }}
                  />
                  <Text style={{ marginLeft: 10 }}>{`${chef.firstName}\n`}</Text>
                  <Text style={{ marginLeft: -50 }} note>{`\n${chef.status || ''}`}</Text>
                </ListItem>
              )}
            />
          </Content>
        </Container>
      );
    }
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
