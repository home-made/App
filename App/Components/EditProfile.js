import React, { Component } from "react";
import { StyleSheet, AsyncStorage, Image, Container } from "react-native";
import { View, Input, Item, Button, Text } from "native-base";
import { Grid, Col, Row } from "react-native-easy-grid";
import { Actions } from "react-native-router-flux";
import axios from "axios";

export default class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      userId: '',
      userName: '',
      userPic: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    let userId, userName, userPic;
    async function getProfile() {
      try {
        const data = await AsyncStorage.getItem('profile');
        if (data !== null && data !== undefined) {
          // console.log('async data: ', data);
          data = JSON.parse(data);
          userId = data.identityId, userName = data.name, userPic = data.extraInfo.picture_large;
        }
      } catch (err) {
        console.log('Error getting data: ', err);
      }
    }

    getProfile()
      .then(() => {
        this.setState({ userId: userId, userName: userName, userPic: userPic })
      })
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

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center"
        }}
      >
        <Text>
          {this.state.userName}
        </Text>

        <Image
          style={{
            borderRadius: 75,
            height: 150,
            width: 150,
            marginTop: 70,
            marginBottom: 20
          }}
          source={{
            uri: this.state.userPic
          }}
        />

        <Item>
          <Text>Update Address:</Text>
        </Item>
        <Item>
          <Input
            placeholder="Address"
            keyboardType={"ascii-capable"}
            onChangeText={address =>
              this.setState({ address }, () => console.log(address))}
          />
        </Item>
        <Item>
          <Text>Update Phone Number:</Text>
        </Item>
        <Item>
          <Input
            placeholder="Phone Number"
            onChangeText={phone => this.setState({ phone })}
          />
        </Item>
        <Item>
          <Text>Update Status:</Text>
        </Item>
        <Item>
          <Input
            placeholder="Status"
            onChangeText={status => this.setState({ status })}
          />
        </Item>
        <Item>
          <Button
            style={{ marginTop: 10 }}
            onPress={() => {
              this.handleSubmit();
            }}
          >
            <Text>Submit</Text>
          </Button>
        </Item>
      </View>
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