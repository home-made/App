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
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import { Kaede } from 'react-native-textinput-effects';
import axios from 'axios';

export default class ChefForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authId: null,
      phone: null,
      firstName: null,
      lastName: null,
      email: null
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
    console.log('phone number: ', this.state.phone);
    console.log('first name: ', this.state.firstName);
    console.log('last name: ', this.state.lastName);
    if (this.state.phone !== null && this.state.firstName !== null && this.state.lastName !== null) {
      axios.put(`http://homemadeapp.org:3000/user/${this.state.authId}`, { phoneNumber: this.state.phone, firstName: this.state.firstName, lastName: this.state.lastName })
        .then((res) => console.log(res.data))
        .catch((err) => console.log('Error updating user to chef status: ', err));

      Actions.cuisines({ type: ActionConst.RESET });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: 'MarkerFelt-Thin', fontSize: 50, alignSelf: 'center', color: '#EC6969'}}>Tell us about</Text>
          <Text style={{ fontFamily: 'MarkerFelt-Thin', fontSize: 50, alignSelf: 'center', color: '#EC6969'}}>yourself</Text>
        </View>
        <Container style={{flex:0.4, justifyContent: 'center' }}>
          <Content>
            <Kaede
              style={{ backgroundColor: '#f9f5ed', marginTop: 10 }}
              label={'First Name'}
              labelStyle={{ color: '#EC6969' }}
              inputStyle={{ color: '#91627b' }}
              onChangeText={(e) => this.setState({ firstName: e })}
            />
            <Kaede
              style={{ backgroundColor: '#f9f5ed', marginTop: 10 }}
              label={'Last Name'}
              labelStyle={{ color: '#EC6969' }}
              inputStyle={{ color: '#91627b' }}
              onChangeText={(e) => this.setState({ lastName: e })}
            />
            <Kaede
              style={{ backgroundColor: '#f9f5ed', marginTop: 10 }}
              label={'Phone Number'}
              labelStyle={{ color: '#EC6969' }}
              inputStyle={{ color: '#91627b' }}
              onChangeText={(e) => this.setState({ phone: e })}
            />
            <Kaede
              style={{ backgroundColor: '#f9f5ed', marginTop: 10 }}
              label={'E-mail'}
              labelStyle={{ color: '#EC6969' }}
              inputStyle={{ color: '#91627b' }}
              onChangeText={(e) => this.setState({ email: e })}
            />
          </Content>
        </Container>

        <View style={styles.button}>
          <Button
            large
            transparent
            bordered
            onPress={() => {
              this.submitForm();
            }}
          >
            <Text>Submit</Text>
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
    margin: 10,
    marginTop: 90,
  },
  button: {
    flex: .2,
    justifyContent: "center",
    alignSelf: 'center'
  }
});
