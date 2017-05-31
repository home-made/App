import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Container, Content, Button, Icon, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';

export default class ChefForm extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Button transparent primary iconLeft large bordered onPress={() => { Actions.signature() }}>
            <Icon name="beer" />
            <Text>Become a Chef!</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ffffff"
  }
});

//Wow nice component Man...