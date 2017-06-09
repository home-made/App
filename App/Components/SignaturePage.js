import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  AsyncStorage,
} from "react-native";
import { Button } from 'native-base';
import SignatureCapture from "react-native-signature-capture";
import Icon from "react-native-vector-icons/Ionicons";
import { Actions, ActionConst } from "react-native-router-flux";
import DropdownAlert from 'react-native-dropdownalert';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from "axios";

let authId;
let address;
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

    console.log(address);
    console.log(authId);
    axios.put(`http://homemadeapp.org:3000/sig/${authId}`, { isChef: true, pathname: result.pathName, address: address })
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
      `If your signature is correct, press confirm or press reset to redo!`,
    );
  }

  dismissAlert = () => {
    this.dropdown.onClose();
  };

  onClose(data) {
    console.log(data);
  }

  render() {
    const styles = {
      signature: {
        flex: 1,
        borderColor: "#000033",
        borderWidth: 1
      },
      signatureText: {
        fontFamily: 'MarkerFelt-Wide',
        fontSize: 25,
        textAlign: 'center',
        color: '#505050'
      },
      actionButtonIcon: {
        fontSize: 25,
        height: 26,
        color: 'white',
      },
      addressBar: {
        flex: .54,
        flexDirection: 'row',
        marginTop: 10
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
      },
      buttonStyle3: {
        flex: 1, justifyContent: "center", alignItems: "center", height: 50,
        margin: 10,
        backgroundColor: '#F0B073'
      },
      buttonText: {
        fontFamily: 'MarkerFelt-Thin',
        fontSize: 20,
        color: '#505050'
      }
    };
    
    return (
      <View style={{ flex: 1, flexDirection: "column", marginTop: 63 }}>
        <Text style={styles.signatureText}>Sign Below</Text>
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
        
        <View style={styles.addressBar}>
          <GooglePlacesAutocomplete
          placeholder='Address'
          minLength={2}
          autoFocus={false}
          listViewDisplayed='auto'
          fetchDetails={true}
          renderDescription={(row) => row.description}
          onPress={(data, details = null) => {
            console.log(data);
            console.log(details);
            address = data.description;
          }}
          getDefaultValue={() => {
            return '';
          }}
          query={{
            key: 'AIzaSyDySPBT6q0rzspVjjJWZDnEGCaT3CJBMKQ',
            language: 'en',
            types: 'address'
          }}
          styles={{
            description: {
              fontWeight: 'bold'
            },
            predefinedPlacesDescription: {
              color: '#1faadb'
            },
          }}
          currentLocation={true}
          currentLocationLabel="Current location"
          nearbyPlacesAPI='GooglePlacesSearch'
          GoogleReverseGeocodingQuery={{
          }}
          GooglePlacesSearchQuery={{
            rankby: 'distance',
            types: 'food',
          }}
  
  
          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
  
          debounce={200}
        />
        </View>
        <View style={{flex: .2, flexDirection: 'row'}}>
          <Button 
            rounded transparent bordered dark
            style={styles.buttonStyle1}
            textStyle={{fontSize: 18}}
            onPress={() => { this.saveSign()} }
          >
            <Text style={styles.buttonText}>Save</Text>
          </Button>
          <Button
            rounded transparent bordered dark
            style={styles.buttonStyle2}
            textStyle={{fontSize: 18}}
            onPress={() => { this.resetSign()} }
          >
            <Text style={styles.buttonText}>Reset</Text>
          </Button>
        </View>

        <View
          style={{
            flex: .3,
            flexDirection: 'row'
          }}
        >
          <Button
            rounded transparent bordered dark
            style={styles.buttonStyle3}
            textStyle={{fontSize: 18}}
            onPress={() => {Actions.homepage({ type: ActionConst.RESET })}}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </Button>
          
        </View>

        <View style={{ alignItems: "center" }}>
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
