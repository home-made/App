import React, { Component } from "react";
import { StyleSheet, AsyncStorage, Image, Container } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, Input, Item, Button, Text, Toast, Content } from "native-base";
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
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    let userId, userName, userPic;
    let newUrl = this.props.newUrl;
    async function getProfile(url) {

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

          if (url) {
            data.extraInfo.picture_large = url;
            data.picture_large = url;
            data.picture = url;
            async function setProfile() {
              try {
                await AsyncStorage.setItem("profile", JSON.stringify(data));
              } catch (error) {
                console.log(error);
              }
            }
            setProfile().then(() => console.log("UPDATED"));
          }
        }
      } catch (err) {
        console.log("Error getting data: ", err);
      }
    }

    getProfile(newUrl).then(() => {
      this.setState(
        { userId: userId, userName: userName, userPic: userPic },
        () => {
          console.log(this.state.userId);
          axios
            .get("http://localhost:3000/user/" + this.state.userId)
            .then(res => {
              this.setState({ userPic: res.data[0].profileUrl }, () =>
                console.log(this.state.user)
              );
            });
        }
      );
    });
  }
  componentWillReceiveProps() {
    console.log("IN RECEIVE PROPS", this.props);
    this.componentWillMount();
  }
  handleSubmit() {
    console.log("HANDLE SUBMIT CALLED");
    let send = {};
    console.log("SEND: ", send);
    if (this.state.address) {
      send.address = this.state.address;
    }
    if (this.state.phone) {
      send.phoneNumber = this.state.phone;
    }
    if (this.state.status) {
      send.status = this.state.status;
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
      <KeyboardAwareScrollView>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
            marginTop: 50
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
              marginTop: 70
            }}
            source={{
              uri: this.state.userPic
            }}
          />
          <Item>
            <Button
              style={{ margin: 10 }}
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
                buttonText: "Okay",
                duration: 1000
              });
            }}
          >
            <Text>Submit</Text>
          </Button>
        </Item>
        </View>       
      </KeyboardAwareScrollView>
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

/*

       <Container 
          style={{
          flex: 1,
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center"
        }}
        >

*/
