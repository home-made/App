import React, { Component } from "react";
import { View, StyleSheet, AsyncStorage } from "react-native";
import {
  Container,
  Content,
  Button,
  Icon,
  Text,
  Form,
  Input,
  Label,
  Item
} from "native-base";
import { Actions, ActionConst } from "react-native-router-flux";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';

export default class ChefForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authId: null,
      address: null,
      phone: null
    };

    this.submitForm = this.submitForm.bind(this);
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

  submitForm() {
    console.log('address: ', this.state.address);
    console.log('phone number: ', this.state.phone);
    if (this.state.address !== null && this.state.phone !== null) {
      axios.put(`http://homemadeapp.org:3000/user/${this.state.authId}`, { address: this.state.address, phoneNumber: this.state.phone })
        .then((res) => console.log(res.data))
        .catch((err) => console.log('Error updating user to chef status: ', err));
    }
    Actions.signature({ type: ActionConst.RESET });
  }

  render() {
    return (
      <View style={styles.container}>
        <Container style={{flex:0.4}}>
          <Content>
            <Form>
              <Item stackedLabel>
                <Label>Phone Number</Label>
                <Input placeholder={'eg: 000-000-0000'} onChangeText={(e) => this.setState({ phone: e })}/>
              </Item>
            </Form>
            </Content>
        </Container>

        <GooglePlacesAutocomplete
          placeholder='Address'
          minLength={2}
          autoFocus={false}
          listViewDisplayed='auto'
          fetchDetails={true}
          renderDescription={(row) => row.description}
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true 
            console.log(data);
            console.log(details);
            this.setState({
              address: data.description
            })
          }}
          getDefaultValue={() => {
            return '';
          }}
          query={{
            // http://developers.google.com/places/web-service/autocomplete 
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
          nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch 
          GoogleReverseGeocodingQuery={{
            // available options for GoogleReverseGeocoding API : http://developers.google.com/maps/documentation/geocoding/intro 
          }}
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : http://developers.google.com/places/web-service/search 
            rankby: 'distance',
            types: 'food',
          }}
  
  
          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities 
  
          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        />

        <View style={styles.button}>
          <Button
            large
            transparent
            bordered
            onPress={() => {
              this.submitForm();
            }}
          >
            <Icon name="beer" />
            <Text>Become a Chef!</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: "center",
    marginTop: 90,
  },
  button: {
    flex: .5,
    justifyContent: "space-around",
    alignSelf: 'center'
  }
});
