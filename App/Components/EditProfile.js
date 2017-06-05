import React, { Component } from "react";
import { StyleSheet, AsyncStorage, Image, Container } from "react-native";
import { View, Input, Item, Button, Text, Toast } from "native-base";
import { Actions, ActionConst } from "react-native-router-flux";
import axios from "axios";

export default class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      showToast: false,
      userId: "",
      userName: "",
      userPic: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    let userId, userName, userPic;

    async function getProfile() {
      try {
        const data = await AsyncStorage.getItem("profile");
        if (data !== null && data !== undefined) {
          data = JSON.parse(data);
          console.log("async data: ", data);
          if (data.identityId) {
            userId = data.identityId;
          } else {
            userId = data.userId;
          }
          userName = data.name;
          if (data.extraInfo) {
            userPic = data.extraInfo.picture_large;
          } else {
            data.picture;
          }
        }
      } catch (err) {
        console.log("Error getting data: ", err);
      }
    }

    getProfile().then(() => {
      this.setState({ userId: userId, userName: userName, userPic: userPic });
    });
  }

  handleSubmit() {
    console.log("HANDLE SUBMIT CALLED");
    let send = { authId: this.state.userId };
    console.log("SEND: ", send);
    if (this.state.address) {
      send.address = this.state.address;
    }
    if (this.state.phone) {
      send.phoneNumber = this.state.phone;
    }
    if (this.state.status) {
      send.state = this.state.status;
    }

    axios
      .put("http://localhost:3000/user/" + this.state.userId, send)
      .then(res => {
        console.log(res.data);
        Actions.cuisines({ type: ActionConst.RESET });
      });
  }

  render() {
    console.log("the state inside EditProfile.js is ", this.state);
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
  
          }}
          source={{
            uri: this.state.userPic
          }}
        />
        <Item>
        <Button
          style={{ margin: 10}}
          onPress={() => {
            this.props.setCameraMode("profile");
            Actions.uploadimage();
          }}
        >
          <Text>Update Profile Picture</Text>
        </Button>
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
          <Input
            placeholder="Phone Number"
            onChangeText={phone => this.setState({ phone })}
          />
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
              Toast.show({
                supportedOrientations: ["portrait", "landscape"],
                text: "Profile Updated",
                position: "bottom",
                buttonText: "Okay"
              });
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
