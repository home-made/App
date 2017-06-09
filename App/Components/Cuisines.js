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
    const styles = {
      scrollView: {
        alignSelf: "stretch"
      },
      list: {
        marginTop: 60
      },
      text: {
        color: '#505050',
        fontFamily: 'Noteworthy-Bold'
      }
    }

    return (
      <ScrollView style={styles.scrollView}>
        <List style={styles.list}>
          {this.state.genres.map((genre, index) => {
            return (
              <ListItem
                onPress={() => this.props.setCuisineType(genre)}
                key={index}
              >
                <Text style={styles.text}>
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
