import React, { Component } from "react";
import Camera from "react-native-camera";
import { Actions } from "react-native-router-flux";
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
import RNFetchBlob from "react-native-fetch-blob";
// import File from 'file-api';
// require the module
var RNFS = require("react-native-fs");

class Upload extends Component {
  constructor() {
    super();
  }
  takePicture() {
    this.camera.capture().then(data => {
      console.log(data);
      // var file = new File({
      //   name: data.path,       // required
      //   type: "image/jpeg",         // optional
      //   buffer: new Buffer("abcdefg,hijklmnop, qrs, tuv, double-u, x, y and z") // a read stream (emits `error`, `data`, `end`)
      // });

      axios.post("http://localhost:3000/dish/image").then(res => {
        console.log("res", res);
      });
      //   RNFetchBlob.fetch('POST', 'http://localhost:3000/dish/image', {
      //     Authorization : "Bearer access-token",
      //     'Content-Type' : 'multipart/form-data',
      //   }, [
      //     // append field data from file path
      //     {
      //       name : 'image',
      //       filename : 'image.png',
      //       data: RNFetchBlob.wrap(data.path)
      //     }]).then(res=>{
      //   console.log(res)
      // }).catch(err => {console.log(err);});
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
          <Text style={capture} onPress={this.takePicture.bind(this)}>
            [CAPTURE]
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
    margin: 40
  }
});

export default Upload;
