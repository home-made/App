import React, { Component } from "react";
import { StyleSheet, AsyncStorage, Image } from "react-native";
import { View, Input, Item, Button, Text, Toast, Picker,Label,Content,Container,Form} from "native-base";
import { Actions } from "react-native-router-flux";
import axios from "axios";

export default class ManageDish extends Component {
  constructor() {
    super();
    this.state = {
      showToast: false,
      userId: '',
      userName: '',
      userPic: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // let userId, userName, userPic;
    // async function getProfile() {
    //   try {
    //     const data = await AsyncStorage.getItem('profile');
    //     if (data !== null && data !== undefined) {
    //       // console.log('async data: ', data);
    //       data = JSON.parse(data);
    //       userId = data.identityId, userName = data.name, userPic = data.extraInfo.picture_large;
    //     }
    //   } catch (err) {
    //     console.log('Error getting data: ', err);
    //   }
    // }

    // getProfile()
    //   .then(() => {
    //     this.setState({ userId: userId, userName: userName, userPic: userPic })
    //   })
    this.setState({dish:this.props.fetchDish()},() =>console.log(this.state.dish));
  }

  handleSubmit() {
    let send = { authId: this.state.userId };
    console.log('SEND: ', send);
    if (this.state.address) {
      send.address = this.state.address;
    }
    if (this.state.phone) {
      send.phone = this.state.phone;
    }
    if (this.state.status) {
      send.state = this.state.status;
    }

    axios.put("http://localhost:3000/user", send).then(Actions.cuisines());
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
                onChangeText={cashDonation => {
                    let dish = this.state.dish;
                    dish.cashDonation = cashDonation
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
    alignItems: "center"
  }
});
