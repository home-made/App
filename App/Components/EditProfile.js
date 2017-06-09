import React, { Component } from "react";
import { StyleSheet, AsyncStorage, Image, Container } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, Button, Text, Toast, Input } from "native-base";
import { Actions, ActionConst } from "react-native-router-flux";
import { Kaede } from 'react-native-textinput-effects';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Autocomplete from 'react-google-autocomplete';
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
          console.log('userId: ', this.state.userId);
          axios
            .get("http://homemadeapp.org:3000/user/" + this.state.userId)
            .then(res => {
              this.setState({ userPic: res.data[0].profileUrl }, () =>
                console.log(this.state.user)
              );
            })
            .catch(err => console.log(err));
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
      .put("http://homemadeapp.org:3000/user/" + this.state.userId, send)
      .then(res => {
        console.log(res.data);
        Actions.cuisines({ type: ActionConst.RESET });
      });
  }

  render() {
    const styles = {
      container: {
        flex: 1,
        marginTop: 75
      },
      name: {
        fontFamily: 'MarkerFelt-Wide',
        fontSize: 50,
        textAlign: 'center',
        color: '#505050'
      },
      profilePic: {
        borderRadius: 75,
        height: 150,
        width: 150,
        marginTop: 20,
        alignSelf: 'center'
      },
      label: {
        fontFamily: 'MarkerFelt-Thin',
        color: '#9DDDE0'
      },
      input: {
        fontFamily: 'MarkerFelt-Thin',
        color: '#505050'
      },
      kaede: {
        backgroundColor: '#f9f5ed',
        marginTop: 10
      },
      buttons: {
        margin: 10,
        alignSelf: 'center'
      },
      buttonText: {
        fontFamily: 'MarkerFelt-Thin',
        fontSize: 20,
        color: '#505050'
      }
    }

    console.log("the state inside EditProfile.js is ", this.state);
    return (
      <KeyboardAwareScrollView automaticallyAdjustContentInsets={false}>
        <View style={styles.container}>

          <View>
            <Text style={styles.name}>{this.state.userName}</Text>

            <Image
              style={styles.profilePic}
              source={{uri: this.state.userPic}}
            />

            <Button
              rounded transparent bordered dark
              style={styles.buttons}
              onPress={() => {
                this.props.setCameraMode("profile");
                Actions.uploadimage();
              }}
            >
              <Text style={styles.buttonText}>Update Profile Picture</Text>
            </Button>
          </View>

          <View>
            <Kaede
              style={styles.kaede}
              label={'Status'}
              placeholder={this.state.user.status ? this.state.user.status : 'Update Your Status!'}
              labelStyle={styles.label}
              inputStyle={styles.input}
              onChangeText={status => this.setState({ status })}
            />

            <Kaede
              style={styles.kaede}
              label={'Phone Number'}
              placeholder={this.state.user.phoneNumber}
              labelStyle={styles.label}
              inputStyle={styles.input}
              onChangeText={phone => this.setState({ phone })}
            />

            <Kaede
              style={styles.kaede}
              label={'Address'}
              placeholder={this.state.user.address}
              labelStyle={styles.label}
              inputStyle={styles.input}
              onChangeText={address =>
                this.setState({ address }, () => console.log(address))}
            >
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
            </Kaede>
          </View>
          <Button
            rounded transparent bordered dark
            style={styles.buttons}
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
            <Text style={styles.buttonText}>Submit</Text>
          </Button>

        </View>
      </KeyboardAwareScrollView>
    );
  }
}

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
