import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableHighlight, AsyncStorage } from "react-native";
import SignatureCapture from "react-native-signature-capture";
import { Icons } from "react-native-vector-icons/Ionicons";
import axios from 'axios';

export default class SignaturePage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      authId: ''
    }
  }
  
  componentWillMount() {
    let userId;
    async function grabAuthId() {
      try {
        const profile = await AsyncStorage.getItem('profile');
        if (profile !== null && profile !== undefined) {
          userId = JSON.parse(profile).userId;
          console.log(JSON.parse(profile).userId);
          console.log(userId);
        }
      } catch (err) {
        console.log("Error getting profile: ", err);
      }
    }
    grabAuthId()
      .then(() => {
        this.setState({
          authId: userId
        })
      });
  }

  saveSign() {
    this.refs["sign"].saveImage();
    axios.put(`http://localhost:3000/user/${this.state.authId}`, { isChef: true })
      .then((res) => console.log(res.data))
      .catch((err) => console.log('Error updating user to chef status: ', err));
  }

  resetSign() {
    this.refs["sign"].resetImage();
  }

  _onSaveEvent(result) {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    console.log(result);
  }
  _onDragEvent() {
    // This callback will be called when the user enters signature
    console.log("dragged");
  }

  render() {

    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <Text style={{ alignItems: "center", justifyContent: "center" }}>
          Signature Capture Extended{" "}
        </Text>
        <SignatureCapture
          style={[{ flex: 1 }, styles.signature]}
          ref="sign"
          onSaveEvent={this._onSaveEvent}
          onDragEvent={this._onDragEvent}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          showTitleLabel={false}
          viewMode={"portrait"}
        />

        <View style={{ flex: 1, flexDirection: "row" }}>
          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              this.saveSign();
            }}
          >
            <Text>Save</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              this.resetSign();
            }}
          >
            <Text>Reset</Text>
          </TouchableHighlight>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  signature: {
    flex: 1,
    borderColor: "#000033",
    borderWidth: 1
  },
  buttonStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "#eeeeee",
    margin: 10
  }
});
