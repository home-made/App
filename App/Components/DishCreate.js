import React, { Component } from "react";
import SocketIO from "socket.io-client";
import { StyleSheet, TextInput, View, Alert } from "react-native";
import { Actions } from "react-native-router-flux";
// import SocketIO from "socket.io-client";÷
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
const axios = require("react-native-axios");
var socket = new SocketIO("localhost:3000");

export default class DishView extends Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedItem: 'undefined',
        selected1: 0,
      dish:{
        name: "",
        donation: 0,
        quantity: 0,
        description: ""
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }å
  componentWillMount(){
//    var socket = new SocketIO                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       ("localhost:3000");

    socket.connect();
    console.log('b4id is',socket.id)

    socket.on("connect", () => {
      console.log('id is',socket.id)
      socket.on("fresh", message => {
        console.log(message);
      });

    });
    
    this.setState({genres:['Select a Cuisine Style'].concat(this.props.getStyles())})
  }
  handleSubmit() {
    console.log('b4')
    socket.emit("fresh", "right back you bitch");
    console.log('a4ter')
    // console.log(this.state.dish)
    // axios.post("http://localhost:3000/dish/add", {
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
    // this.props.setDish(this.state.dish)
    // Actions.uploaddishimage()
  }
  onValueChange (value) {
    console.log(this.state.genres[value])
    let dish = this.state.dish
    dish['cuisineType'] = this.state.genres[value]
    this.setState({
        selected1 : value, dish
    },() =>console.log(this.state.dish));
  }
  render() {
    const price = '$'+this.state.donation;
    const { container } = styles;
    const onButtonPress = () => {
      this.setState({ dishText: "freshly" });
    };
    return (
      <Container   style={{
          flex: 1,
          flexDirection: "column",


        }}>
        <Content >
          <Form style={{ marginTop: 100 }}>
            <Item>
              <Input
                placeholder="Name"
                onChangeText={name => {
                   let dish = this.state.dish;
                  dish.name = name;
                  this.setState({dish},()=>console.log(this.state.dish));

                }}
                value={this.state.dish.name}
              />
            </Item>
            <Item>
              <Input
                placeholder="Description"
                onChangeText={description =>{
                  let dish = this.state.dish;
                  dish.description = description
                  this.setState({dish},()=>console.log(this.state.dish));
                }}
                value={this.state.dish.description}
              />
            </Item>
            <Item stackedLabel>
              <Label>$</Label>
              <Input 
                placeholder="Donation Amount"
                keyboardType={"number-pad"}
                onChangeText={donation => {
                    socket.on('fresh', 'imherebitch')
                    console.log('bitch')
                    let result = donation.split('')
                    result.shift()
                    result.shift()
                    let dish = this.state.dish;
                    dish.donation = donation
                    this.setState({ dish},()=> console.log(this.state.dish))
                  }
                  }
              
                value={this.state.dish.donation}
              />
            </Item>
            <Item>
              <Input
                placeholder="Quantity"
                keyboardType={"number-pad"}
                onChangeText={quantity =>{
                    let dish = this.state.dish;
                    dish.quantity = quantity;
                    this.setState({ dish},()=> console.log(this.state.dish))
                  }}
                value={this.state.dish.quantity}
              />
            </Item>
             <Picker
                supportedOrientations={['portrait','landscape']}
                iosHeader="Select one"
                mode="dropdown"
                selectedValue={this.state.selected1}
                onValueChange={this.onValueChange.bind(this)}>
                {/*<Item label="Select a Cuisine Style" value={0} />*/}
                { this.state.genres ? this.state.genres.map((curr,ind) => {
                  return (
                    <Item label={curr} value={ind} />
                  );

                }): {}}
            </Picker>
            <ListItem>
              <CheckBox checked={true} />
              <Text>Daily Stand Up</Text>
            </ListItem>
            <ListItem>
                <CheckBox checked={false} />
                <Text>Discussion with Client</Text>
            </ListItem>
            <Button style={{ marginTop: 70}} onPress={() => this.handleSubmit()}>
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
