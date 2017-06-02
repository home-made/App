import React, { Component } from "react";
import { StyleSheet, AsyncStorage,Image,TextInput, View, Alert } from "react-native";
import { Actions, ActionConst} from "react-native-router-flux";
import {
  Container,
  Text,
  Content,
  Input,
  Item,
  Form,
  Button,
  Left,
  Header,
  Icon,
  Body,
  Title,
  Right
} from "native-base";
const axios = require("react-native-axios");

export default class DishConfirm extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentWillMount(){
    console.log('mounted big fella confirm big fella')
    this.setState({dish:this.props.fetchDish()},() =>{
      let userId, userName, userPic;
      let dish = this.state.dish
      async function getProfile() {
        try {
          const data = await AsyncStorage.getItem('profile');
          if (data !== null && data !== undefined) {
            data = JSON.parse(data);
            console.log(data.userId)
            console.log('dish',dish)
            userId = data.userId
            return userId
            
        }
        } catch (err) {
          console.log('Error getting data: ', err);
        }
      }
      getProfile()
        .then((res) => {
          dish.chefId = res
          dish.isActive = true
          dish.allergies = []
          this.setState({dish},()=> {
            console.log(this.state.dish)
            this.props.setDish(dish)
          })
        })
      
    })
  }
  onSubmit() {
    axios.post("http://localhost:3000/dish/add", this.state.dish)
    .then(res => {
      console.log(res)
      Actions.chefPanel({type: ActionConst.RESET})
    })
  }
  render() {
    const { container } = styles;
    const onButtonPress = () => {
      this.setState({ dishText: "freshly" });
    };
    console.log('dish state is ',this.state)
    return (
      <Container style={{marginTop: 80,alignItems: 'center'}}>
        <Image source={{ uri:this.state.dish.dishImages[0]}}  
        style={{width: 200, height: 200}}
          resizeMode={Image.resizeMode.center} />
          <Body>
            <Title>Name: {this.state.dish.name}</Title>
            <Text>Description: {this.state.dish.description}</Text>
            <Text>Donation: ${this.state.dish.cashDonation}</Text>
            <Text>Quantity: {this.state.dish.quantity}</Text>
            

          </Body>
          <Right />

        <Content padder>
           <Button onPress={() => this.onSubmit()}>
              <Text>Confirm </Text>
            </Button>
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