import React, { Component } from "react";
import Camera from "react-native-camera";
import { AsyncStorage, TouchableHighlight } from "react-native";
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
import { Container, Content, List, ListItem, Image } from "native-base";
import axios from "react-native-axios";

class Upload extends Component {
  constructor() {
    super();
    this.state = {
      cameraType: Camera.constants.Type.back
    };
    this.switchCamera = this.switchCamera.bind(this);
  }
  componentDidMount() {
    async function getProfile() {
      try {
        const data = await AsyncStorage.getItem("profile");
        if (data !== null && data !== undefined) {
          data = JSON.parse(data);
          return data;
        }
      } catch (err) {
        console.log("Error getting data: ", err);
      }
    }

    getProfile().then(data => {
      this.setState({ userId: data.userId });
    });
    this.setState({ cameraMode: this.props.fetchCameraMode() });
    this.setState({ dish: this.props.fetchDish() });
  }

  takePicture() {
    let opt = {
      target: Camera.constants.CaptureTarget.disk
    };
    console.log("upload status is", this.state.cameraMode);
    // console.log(mode)
    axios
      .get("http://homemadeapp.org:3000/api/")
      .then(res => {
        this.camera.capture(opt).then(data => {
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
              let dish = this.state.dish;
              dish["dishImages"] = [response.body.postResponse.location];
              this.props.setDish(dish);
              console.log("baby dish", dish);
              Actions.dishconfirm();
            });
          } else {
            let math = Math.random();
            let options = {
              keyPrefix: `profile${math}`,
              bucket: "homemadeprofile",
              region: "us-west-1",
              accessKey: res.data.key,
              secretKey: res.data.secret,
              successActionStatus: 201
            };
            RNS3.put(file, options).then(response => {
              if (response.status !== 201)
                throw new Error("Failed to upload image to S3");
              axios
                .put("http://homemadeapp.org:3000/user/" + this.state.userId, {
                  profileUrl: response.body.postResponse.location
                })
                .then(res => {
                  Actions.edit({
                    newUrl: response.body.postResponse.location,
                    type: ActionConst.RESET
                  });
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

  switchCamera() {
    var cameraPosition = this.state.cameraType === Camera.constants.Type.back
      ? Camera.constants.Type.front
      : Camera.constants.Type.back;
    this.setState({
      cameraType: cameraPosition
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
          type={this.state.cameraType}
          style={preview}
          aspect={Camera.constants.Aspect.fill}
        >
          {/*<Text style={capture} onPress={() => this.takePicture()}>
            CAPTURE
          </Text>*/}

          <Text onPress={() => this.switchCamera()} style={capture}>Flip</Text>

          <Text onPress={() => this.takePicture()} style={capture}>Take</Text>

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
    justifyContent: "flex-end",
    alignItems: "center",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    color: "#000",
    padding: 10,
    margin: 10
  },
  buttonBar: {
    flexDirection: "row",
    position: "absolute",
    bottom: 25,
    right: 0,
    left: 0,
    justifyContent: "center"
  },
  button: {
    padding: 10,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    margin: 5
  },
  buttonText: {
    color: "#FFFFFF"
  }
});

export default Upload;
