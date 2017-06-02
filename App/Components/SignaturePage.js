import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableHighlight, AsyncStorage } from "react-native";
import SignatureCapture from "react-native-signature-capture";
import { Icons } from "react-native-vector-icons/Ionicons";
import { Actions, ActionConst } from 'react-native-router-flux';
import axios from 'axios';

export default class SignaturePage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      authId: '',
      isChef: false
    }
  }
  
  componentWillMount() {
    let userId;
    async function grabAuthId() {
      try {
        const profile = await AsyncStorage.getItem('profile');
        if (profile !== null && profile !== undefined) {
          userId = JSON.parse(profile).userId;
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
      this.setState({
        isChef: true
      })
    Actions.homepage({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  resetSign() {
    this.refs["sign"].resetImage();
  }

  onSaveEvent(result) {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    console.log(result);
  }
  onDragEvent() {
    console.log("dragged");
  }

  render() {
    console.log(this.props)
    return (
      <View style={{ flex: 1, flexDirection: "column", marginTop: 63 }}>
        <SignatureCapture
          style={[{ flex: 1 }, styles.signature]}
          ref="sign"
          onSaveEvent={this.onSaveEvent}
          onDragEvent={this.onDragEvent}
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
        <View style={{ flex: 0.3, alignItems: 'center'}}>
          <Text style={{ alignItems: "center", justifyContent: "center" }}>
            By signing this form, I agree to these
          </Text>
          <Text style={{ alignItems: "center", justifyContent: "center", color: 'blue' }}>
            terms and conditions
          </Text>
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
