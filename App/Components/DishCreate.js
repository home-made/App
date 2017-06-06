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
  Button,
  Label,
  Picker,
  CheckBox,
  ListItem
} from "native-base";
export default class DishView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: "undefined",
      selected1: 0,
      dish: {
        name: "",
        cashDonation: 0,
        quantity: 0,
        description: ""
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillMount() {
    let genres = this.props.getStyles();
    genres[0]= "Select a Cuisine Style"
    this.setState({
      genres
    });
    this.props.setCameraMode("dish");
  }
  handleSubmit() {
    console.log(this.state.dish);
    // axios.post("http://ec2-52-91-163-176.compute-1.amazonaws.com:3000/dish/add", {
    //   cuisineType: "Chinese",
    //   name: this.state.name,
    //   description: this.state.dishDescriptionText,
    //   dishImages: [
    //     "https://media-cdn.tripadvisor.com/media/photo-s/02/39/2d/21/chinese-dumplings-with.jpg"
    //   ],
    //   chefId: "7564fjasdif",
    //   allergies: ["none"],
    //   cashDonation: 8,
    //   isActive: true,
    //   quantity: 1
    // });
    this.props.setDish(this.state.dish);
    // this.props.setCameraMode()
    Actions.uploadimage();
  }
  onValueChange(value) {
    console.log(this.state.genres[value]);
    let dish = this.state.dish;
    dish["cuisineType"] = this.state.genres[value];
    this.setState(
      {
        selected1: value,
        dish
      },
      () => console.log(this.state.dish)
    );
  }
  render() {
    const price = "$" + this.state.cashDonation;
    const { container } = styles;
    const onButtonPress = () => {
      this.setState({ dishText: "freshly" });
    };
    return (
      <Container
        style={{
          flex: 1,
          flexDirection: "column"
        }}
      >
        <Content>
          <Form style={{ marginTop: 100 }}>
            <Item>
              <Input
                placeholder="Name"
                onChangeText={name => {
                  let dish = this.state.dish;
                  dish.name = name;
                  this.setState({ dish }, () => console.log(this.state.dish));
                }}
                value={this.state.dish.name}
              />
            </Item>
            <Item>
              <Input
                placeholder="Description"
                onChangeText={description => {
                  let dish = this.state.dish;
                  dish.description = description;
                  this.setState({ dish }, () => console.log(this.state.dish));
                }}
                value={this.state.dish.description}
              />
            </Item>
            <Item stackedLabel>
              <Label>$</Label>
              <Input
                placeholder="Donation Amount"
                keyboardType={"number-pad"}
                onChangeText={cashDonation => {
                  let dish = this.state.dish;
                  dish.cashDonation = cashDonation;
                  this.setState({ dish }, () => console.log(this.state.dish));
                }}
                value={this.state.dish.cashDonation}
              />
            </Item>
            <Item>
              <Input
                placeholder="Quantity"
                keyboardType={"number-pad"}
                onChangeText={quantity => {
                  let dish = this.state.dish;
                  dish.quantity = quantity;
                  this.setState({ dish }, () => console.log(this.state.dish));
                }}
                value={this.state.dish.quantity}
              />
            </Item>
            <Picker
              supportedOrientations={["portrait", "landscape"]}
              iosHeader="Select one"
              mode="dropdown"
              selectedValue={this.state.selected1}
              onValueChange={this.onValueChange.bind(this)}
            >
              {/*<Item label="Select a Cuisine Style" value={0} />*/}
              {this.state.genres
                ? this.state.genres.map((curr, ind) => {
                    return <Item label={curr} value={ind} />;
                  })
                : {}}
            </Picker>
            <Button
              style={{ marginTop: 70, alignItems: "center" }}
              onPress={() => this.handleSubmit()}
            >
              <Text>Next</Text>
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
