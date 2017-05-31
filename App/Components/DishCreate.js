import React, { Component } from "react";
import { StyleSheet, TextInput, View, Alert } from "react-native";
import { Actions } from "react-native-router-flux";
import {
  Container,
  Text,
  Content,
  Input,
  Item,
  Form,
  Button
} from "native-base";
const axios = require("react-native-axios");

export default class DishView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dishText: "",
      donationNumber: "",
      quantityNumber: "",
      dishDescriptionText: ""
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit() {
    axios.post("http://localhost:3000/dish/add", {
      cuisineType: "Chinese",
      name: this.state.name,
      description: this.state.dishDescriptionText,
      dishImages: [
        "https://media-cdn.tripadvisor.com/media/photo-s/02/39/2d/21/chinese-dumplings-with.jpg"
      ],
      chefId: "7564fjasdif",
      allergies: ["none"],
      cashDonation: 8,
      isActive: true,
      quantity: 1
    });
  }
  render() {
    const { container } = styles;
    const onButtonPress = () => {
      this.setState({ dishText: "freshly" });
    };
    return (
      <Container>
        <Content>
          <Form style={{ marginTop: 60 }}>
            <Button onPress={() => Actions.uploaddishimage()}>
              <Text>Upload Image </Text>
            </Button>
            <Item>
              <Input
                placeholder="Dish Name"
                onChangeText={dishText => this.setState({ dishText: dishText })}
                value={this.state.dishText}
              />
            </Item>
            <Item>
              <Input
                placeholder="Description"
                onChangeText={dishDescriptionText =>
                  this.setState({ dishDescriptionText })}
                value={this.state.dishDescriptionText}
              />
            </Item>
            <Item>
              <Input
                placeholder="Cash Donation $"
                keyboardType={"number-pad"}
                onChangeText={donationNumber =>
                  this.setState({ donationNumber })}
                value={this.state.donationNumber}
              />
            </Item>
            <Item>
              <Input
                placeholder="Cash Donation $"
                keyboardType={"number-pad"}
                onChangeText={quantityNumber =>
                  this.setState({ quantityNumber })}
                value={this.state.quantityNumber}
              />
            </Item>
            <Button onPress={() => console.log(this.state)}>
              <Text>Next </Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    color: "#ffffff"
  }
});
