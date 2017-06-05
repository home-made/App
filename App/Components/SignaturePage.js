import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  AsyncStorage
} from "react-native";
import SignatureCapture from "react-native-signature-capture";
import Icon from "react-native-vector-icons/Ionicons";
import { Actions, ActionConst } from "react-native-router-flux";
import DropdownAlert from 'react-native-dropdownalert';
import ActionButton from 'react-native-circular-action-menu';
import Button from 'apsl-react-native-button'
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
  }

  resetSign() {
    this.refs["sign"].resetImage();
  }

  _onSaveEvent(result) {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    console.log(result);

    axios.put(`http://localhost:3000/user/sig/${authId}`, { isChef: true, pathname: result.pathName })
      .then((res) => console.log("SIGNATURE SAVED", res.data))
      .catch((err) => console.log('Error updating user to chef status: ', err));
  }

  _onDragEvent() {
    console.log("dragged");
  }

  showAlert() {
    this.dropdown.alertWithType(
      "success",
      "Signature saved successfully!",
      `Press ✔️ to become a chef!`,
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
          style={ styles.signature}
          ref="sign"
          onSaveEvent={this._onSaveEvent}
          onDragEvent={this._onDragEvent}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          showTitleLabel={false}
          viewMode={"landscape"}
        />
        
        <View style={{flex: .5, flexDirection: 'row'}}>
          <Button style={styles.buttonStyle1} textStyle={{fontSize: 18}} onPress={() => { this.saveSign()} }>
            Save
          </Button>
          <Button style={styles.buttonStyle2} textStyle={{fontSize: 18}} onPress={() => { this.resetSign()} }>
            Reset
          </Button>
        </View>

        <View
          style={{
            flex: .5,
            justifyContent: 'center',
            alignSelf: 'center',
          }}
        >
          <ActionButton buttonColor="rgba(231,76,60,1)" position={'center'} radius={80} outRangeScale={0.8} degrees={360} icon={<Text style={{color: 'white', fontSize: 37}}>🖕🏻</Text>}>
            <ActionButton.Item buttonColor='#F0B073' title="Confirm" onPress={() => {Actions.homepage({ type: ActionConst.RESET })}}>
              <Icon name='md-checkmark' style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#52F26A' title="Back" onPress={() => {Actions.chefform({ type: ActionConst.RESET })}}>
              <Icon name='md-arrow-back' style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
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
          closeInterval={7000}
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
  actionButtonIcon: {
    fontSize: 25,
    height: 26,
    color: 'white',
  },
  buttonStyle1: {
    flex: 1, justifyContent: "center", alignItems: "center", height: 50,
    margin: 10,
    backgroundColor: '#30C82E'
  },
  buttonStyle2: {
    flex: 1, justifyContent: "center", alignItems: "center", height: 50,
    margin: 10,
    backgroundColor: '#CF6151'
  }
  });
