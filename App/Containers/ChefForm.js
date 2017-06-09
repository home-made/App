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
import MaterialsIcon from "react-native-vector-icons/MaterialIcons";
import { Kaede } from "react-native-textinput-effects";
import axios from "axios";

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
    this.setState({
      email: this.props.email,
      phoneNumber: this.props.phoneNumber,
      firstName: this.props.firstName,
      lastName: this.props.lastName
    });

    console.log("IN CHEF FORM WILL MOUNT PROPS ARE", this.props);

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
      this.setState({
        authId: userId
      });
    });
  }

  submitForm() {
    console.log("phone number: ", this.state.phone);
    console.log("first name: ", this.state.firstName);
    console.log("last name: ", this.state.lastName);
    if (
      this.state.phone !== null &&
      this.state.firstName !== null &&
      this.state.lastName !== null
    ) {
      axios
        .put(`http://homemadeapp.org:3000/user/${this.state.authId}`, {
          phoneNumber: this.state.phone,
          firstName: this.state.firstName,
          lastName: this.state.lastName
        })
        .then(res => console.log(res.data))
        .catch(err => console.log("Error updating user to chef status: ", err));

      Actions.cuisines({ type: ActionConst.RESET });
    }
  }

  render() {
    const styles = {
      container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        margin: 10,
        marginTop: 90
      },
      inputContainer: {
        flex: 0.4,
        justifyContent: "center"
      },
      title: {
        fontFamily: "MarkerFelt-Thin",
        fontSize: 50,
        alignSelf: "center",
        color: "#505050"
      },
      button: {
        flex: 0.2,
        justifyContent: "center",
        alignSelf: "center"
      },
      label: {
        color: "#505050"
      },
      input: {
        color: "#9DDDE0"
      },
      kaede: {
        backgroundColor: "#f9f5ed",
        marginTop: 10
      },
      submitButton: {
        fontFamily: "MarkerFelt-Thin",
        fontSize: 20,
        alignSelf: "center",
        color: "#505050"
      }
    };
    return (
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>Tell us about</Text>
          <Text style={styles.title}>yourself</Text>
        </View>
        <Container style={styles.inputContainer}>
          <Content>
            <Kaede
              style={styles.kaede}
              label={"First Name"}
              labelStyle={styles.label}
              inputStyle={styles.input}
              onChangeText={e => this.setState({ firstName: e })}
              defaultValue={this.state.firstName || ""}
            />
            <Kaede
              style={styles.kaede}
              label={"Last Name"}
              labelStyle={styles.label}
              inputStyle={styles.input}
              onChangeText={e => this.setState({ lastName: e })}
              defaultValue={this.state.lastName || ""}
            />
            <Kaede
              style={styles.kaede}
              label={"Phone Number"}
              labelStyle={styles.label}
              inputStyle={styles.input}
              onChangeText={e => this.setState({ phone: e })}
              defaultValue={this.state.phoneNumber || ""}
            />
            <Kaede
              style={styles.kaede}
              label={"E-mail"}
              labelStyle={styles.label}
              inputStyle={styles.input}
              onChangeText={e => this.setState({ email: e })}
              defaultValue={this.state.email || ""}
            />
          </Content>
        </Container>

        <View style={styles.button}>
          <Button
            dark
            large
            transparent
            bordered
            onPress={() => {
              this.submitForm();
            }}
          >
            <Text style={styles.submitButton}>Submit</Text>
          </Button>
        </View>
      </View>
    );
  }
}
