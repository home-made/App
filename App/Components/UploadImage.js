import React, { Component } from "react";
import Camera from "react-native-camera";
import { AsyncStorage } from "react-native";
import { Actions, ActionConst } from "react-native-router-flux";
import { RNS3 } from "react-native-aws3";

import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  Alert,
  Dimensions
} from "react-native";
import { Container, Content, List, ListItem } from "native-base";
import axios from "react-native-axios";

class Upload extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    console.log("here");
    async function getProfile() {
      try {
        const data = await AsyncStorage.getItem("profile");
        if (data !== null && data !== undefined) {
          // console.log('async data: ', data);
          data = JSON.parse(data);
          return data;
          // userId = data.identityId, userName = data.name, userPic = data.extraInfo.picture_large;
        }
      } catch (err) {
        console.log("Error getting data: ", err);
      }
    }

    getProfile().then(data => {
      this.setState({ userId: data.userId });
    });
    this.setState({ cameraMode: this.props.fetchCameraMode() }, () =>
      console.log(this.state)
    );
    this.setState({ dish: this.props.fetchDish() }, () =>
      console.log(this.state.dish)
    );
  }

  takePicture() {
    let opt = {
      target: Camera.constants.CaptureTarget.disk
    };
    console.log("upload status is", this.state.cameraMode);
    // console.log(mode)
    axios
      .get("http://localhost:3000/api/")
      .then(res => {
        this.camera.capture(opt).then(data => {
          console.log(data);
          let file = {
            // `uri` can also be a file system path (i.e. file://)
            uri: data.path,
            name: "image.jpg",
            type: "image/jpeg"
          };

          if (this.state.cameraMode === "dish") {
            let options = {
              keyPrefix: `dish${this.state.dish.name}`,
              bucket: "homemadedishes",
              region: "us-east-1",
              accessKey: res.data.key,
              secretKey: res.data.secret,
              successActionStatus: 201
            };
            RNS3.put(file, options).then(response => {
              if (response.status !== 201)
                throw new Error("Failed to upload image to S3");
              console.log(response.body.postResponse.location);
              let dish = this.state.dish;
              dish["dishImages"] = [response.body.postResponse.location];
              this.props.setDish(dish);
              console.log("baby dish", dish);
              Actions.dishconfirm();
            });
          } else {
            console.log(res);
            let options = {
              keyPrefix: `profile${this.state.userId}`,
              bucket: "homemadeprofile",
              region: "us-west-1",
              accessKey: res.data.key,
              secretKey: res.data.secret,
              successActionStatus: 201
            };
            RNS3.put(file, options).then(response => {
              if (response.status !== 201)
                throw new Error("Failed to upload image to S3");
              console.log(response.body.postResponse.location);
              // console.log('http://localhost:3000/user' + this.state.userId)
              axios
                .put("http://localhost:3000/user/" + this.state.userId, {
                  profileUrl: response.body.postResponse.location
                })
                .then(res => {
                  console.log(res);
                  Actions.edit({ type: ActionConst.RESET });
                });
              // let user = this.state.user
              // user['profileUrl']=response.body.postResponse.location;
              // this.setUser(user)
              // console.log('baby user',user)
            });
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { container, preview, capture } = styles;

    return (
      <View style={container}>
        <Camera
          ref={cam => {
            this.camera = cam;
          }}
          style={preview}
          aspect={Camera.constants.Aspect.fill}
        >
          <Text style={capture} onPress={() => this.takePicture()}>
            CAPTURE
          </Text>
        </Camera>
      </View>
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
  },
  preview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
    //  height: Dimensions.get('window').height,
    //  width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    color: "#000",
    padding: 10,
    margin: 145
  }
});

export default Upload;
