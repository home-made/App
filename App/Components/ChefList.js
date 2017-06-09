import React, { Component } from "react";
import { Image, StyleSheet, View, ScrollView } from "react-native";
import axios from "axios";
import { Container, Content, Text, List, ListItem, Body } from "native-base";

export default class ChefList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.setState({ chefs: this.props.fetchChefs() });
  }

  render() {
    const styles = {
      noChefContainer: {
        marginTop: 70,
        justifyContent: "center",
        flex: 1,
        alignItems: "center"
      },
      noChefText1: {
        fontSize: 60,
        color: "#505050",
        fontFamily: "Noteworthy-Bold",
        textAlign: "center"
      },
      noChefText2: {
        marginTop: 25,
        fontSize: 20,
        color: "#505050",
        fontFamily: "Noteworthy-Bold",
        textAlign: "center"
      },
      container: {
        marginTop: 60,
        justifyContent: "center",
        flex: 1
      },
      image: {
        borderRadius: 38,
        width: 80,
        height: 80
      },
      chefText1: {
        fontSize: 25,
        color: "#505050",
        fontFamily: "Noteworthy-Bold"
      },
      chefText2: {
        fontSize: 15,
        fontFamily: "Noteworthy-Bold"
      }
    };

    let chefs = this.state.chefs;

    if (chefs.length === 0) {
      return (
        <Container style={styles.noChefContainer}>
          <Content>
            <Text style={styles.noChefText1} note>
              Whoops!
            </Text>
            <Text style={styles.noChefText2} note>
              There are currently no chefs available for this cuisine!
            </Text>
          </Content>
        </Container>
      );
    } else {
      return (
        <Container style={styles.container}>
          <Content>
            <List
              dataArray={chefs}
              renderRow={chef => (
                <ListItem
                  onPress={() => {
                    this.props.setChef(chef);
                  }}
                >
                  <Image
                    style={styles.image}
                    source={{
                      uri: chef.profileUrl
                    }}
                  />
                  <Body>
                    <Text style={styles.chefText1}>
                      {chef.firstName} {chef.lastName[0]}
                    </Text>
                    <Text style={styles.chefText2} note>
                      {chef.status || ""}
                    </Text>
                  </Body>
                </ListItem>
              )}
            />
          </Content>
        </Container>
      );
    }
  }
}
