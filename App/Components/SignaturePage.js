import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  AsyncStorage
} from "react-native";
import SignatureCapture from "react-native-signature-capture";
import { Icons } from "react-native-vector-icons/Ionicons";
import { Actions, ActionConst } from "react-native-router-flux";
import DropdownAlert from 'react-native-dropdownalert';
import axios from "axios";

let authId;
export default class SignaturePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authId: "",
      isChef: false
    };
  }

  componentWillMount() {
    let userId;
    async function grabAuthId() {
      try {
        const profile = await AsyncStorage.getItem("profile");
        if (profile !== null && profile !== undefined) {
          userId = JSON.parse(profile).userId;
        }
      } catch (err) {
        console.log("Error getting profile: ", err);
      }
    }
    grabAuthId().then(() => {
      this.setState(
        {
          authId: userId
        },
        () => console.log("authId after setState: ", this.state.authId)
      );
    });
  }

  saveSign() {
    this.refs["sign"].saveImage();
    authId = this.state.authId;

    this.showAlert();
    setTimeout(() => Actions.homepage({ type: ActionConst.RESET }), 100);
  }

  resetSign() {
    this.refs["sign"].resetImage();
  }

  _onSaveEvent(result) {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    console.log(result);

    axios
      .put(`http://localhost:3000/user/${authId}`, {
        isChef: true,
        pathname: result.pathName
      })
      .then(res => console.log(res.data))
      .catch(err => console.log("Error updating user to chef status: ", err));

  }

  _onDragEvent() {
    console.log("dragged");
  }

  showAlert() {
    this.dropdown.alertWithType(
      "success",
      "Signature saved successfully!",
      "You're now a chef!",
    );
  }

  dismissAlert = () => {
    this.dropdown.onClose();
  };

  onClose(data) {
    console.log(data);
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: "column", marginTop: 63 }}>
        <SignatureCapture
          style={[{ flex: 1 }, styles.signature]}
          ref="sign"
          onSaveEvent={this._onSaveEvent}
          onDragEvent={this._onDragEvent}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          showTitleLabel={false}
          viewMode={"landscape"}
        />

        <View style={{ flex: 0.4, flexDirection: "row" }}>
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

        <View
          style={{
            flex: 0.5,
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "center"
          }}
        >
          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              Actions.chefform({ type: ActionConst.RESET });
            }}
          >
            <Text>Back</Text>
          </TouchableHighlight>
        </View>

        <View style={{ flex: 0.25, alignItems: "center" }}>
          <Text style={{ alignItems: "center", justifyContent: "center" }}>
            By signing this form, I agree to these
          </Text>
          <Text
            style={{
              alignItems: "center",
              justifyContent: "center",
              color: "blue"
            }}
          >
            terms and conditions
          </Text>
        </View>
        <DropdownAlert
          ref={ref => this.dropdown = ref}
          containerStyle={{
            backgroundColor: "#6441A4"
          }}
          onClose={data => this.onClose(data)}
        />
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
