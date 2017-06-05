import React, { Component } from "react";
import { StyleSheet, AsyncStorage, Image, Container } from "react-native";
import { View, Input, Item, Button, Text, Toast } from "native-base";
import { Actions } from "react-native-router-flux";
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
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    let userId, userName, userPic;

    async function getProfile() {
      try {
        const data = await AsyncStorage.getItem("profile");
        if (data !== null && data !== undefined) {

          data = JSON.parse(data);
          console.log("async data: ", data);
          (userId = data.identityId || data.userId), (userName = data.name), (userPic =
            data.picture);
        }
      } catch (err) {
        console.log("Error getting data: ", err);
      }
    }

    getProfile().then(() => {
      this.setState({ userId: userId, userName: userName, userPic: userPic }, ()=>{
        console.log(this.state.userId)
        axios.get('http://localhost:3000/user/'+this.state.userId).then(res=>{ 
            this.setState({user:res.data[0]},() => console.log(this.state.user))
          })
      });
    });
  }

  handleSubmit() {
    let send = {};
    console.log("SEND: ", send);
    if (this.state.address) {
      send.address = this.state.address;
    }
    if (this.state.phone) {
      send.phone = this.state.phone;
    }
    if (this.state.status) {
      send.status = this.state.status;
    }
    console.log("http://localhost:3000/user/" + this.state.userId)
    axios.put("http://localhost:3000/user/" + this.state.userId, send).then(Actions.cuisines());
  }

  render() {
    console.log("the state inside EditProfile.js is ", this.state)
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
        <Button
          style={{ marginTop: 10 }}
          onPress={() => {
            this.props.setCameraMode("profile");
            Actions.uploadimage();
          }}
        >
          <Text>Update Profile Pic</Text>
        </Button>
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
              this.handleSubmit()
              Actions.cuisines();
              Toast.show({
                supportedOrientations: ["portrait", "landscape"],
                text: "Profile Updated",
                position: "bottom",
                buttonText: "Okay",
                duration:1000
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
