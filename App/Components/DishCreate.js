import React, { Component } from "react";
import { StyleSheet, TextInput, View, Alert } from "react-native";
import { Actions } from "react-native-router-flux";
import {
  Container,
  Text,
  Content,
  Input,
  Item,
  Form,
  Button,
  Label,
  Picker,
  CheckBox,
  ListItem
} from "native-base";
import { Kaede } from 'react-native-textinput-effects';

export default class DishView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: "undefined",
      selected1: 0,
      dish: {
        name: "",
        cashDonation: 0,
        quantity: 0,
        description: ""
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillMount() {
    let genres = this.props.getStyles();
    genres[0] = "Select a Cuisine Style";
    this.setState({
      genres
    });
    this.props.setCameraMode("dish");
  }
  handleSubmit() {
    console.log("QUANTITY IS", Number(this.state.dish.quantity));
    // axios.post("http://ec2-52-91-163-176.compute-1.amazonaws.com:3000/dish/add", {
    //   cuisineType: "Chinese",
    //   name: this.state.name,
    //   description: this.state.dishDescriptionText,
    //   dishImages: [
    //     "http://media-cdn.tripadvisor.com/media/photo-s/02/39/2d/21/chinese-dumplings-with.jpg"
    //   ],
    //   chefId: "7564fjasdif",
    //   allergies: ["none"],
    //   cashDonation: 8,
    //   isActive: true,
    //   quantity: 1
    // });

      this.props.setDish(this.state.dish);
    // this.props.setCameraMode()
    Actions.uploadimage();
  }
  onValueChange(value) {
    console.log(this.state.genres[value]);
    let dish = this.state.dish;
    dish["cuisineType"] = this.state.genres[value];
    this.setState(
      {
        selected1: value,
        dish
      },
      () => console.log(this.state.dish)
    );
  }
  render() {
    const styles = {
      container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 64
      },
      label: {
        fontFamily: 'MarkerFelt-Thin',
        color: '#505050'
      },
      input: {
        fontFamily: 'MarkerFelt-Thin',
        color: '#9DDDE0'
      },
      kaede: {
        backgroundColor: '#f9f5ed',
        marginTop: 10
      },
      picker: {
        alignSelf: 'center',
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 20,
        marginTop: 10
      },
      nextButton: {
        marginTop: 70,
        alignSelf: "center"
      },
      nextButtonText: {
        fontFamily: 'MarkerFelt-Thin',
        fontSize: 20,
      }
    };

    const price = "$" + this.state.cashDonation;
    const { container } = styles;
    const onButtonPress = () => {
      this.setState({ dishText: "freshly" });
    };
    return (
      <Container style={styles.container}>
        <Content>
        <Kaede
          style={styles.kaede}
          label={'Name'}
          placeholder={'Eg: Burger'}
          labelStyle={styles.label}
          inputStyle={styles.input}
          onChangeText={name => {
            let dish = this.state.dish;
            dish.name = name;
            this.setState({ dish }, () => console.log(this.state.dish));
          }}
          value={this.state.dish.name}
        />

        <Kaede
          style={styles.kaede}
          label={'Description'}
          placeholder={'Eg: Quarter lb, gouda cheese stuffed patty with arugula, tomatoes, etc.'}
          labelStyle={styles.label}
          inputStyle={styles.input}
          onChangeText={description => {
            let dish = this.state.dish;
            dish.description = description;
            this.setState({ dish }, () => console.log(this.state.dish));
          }}
          value={this.state.dish.description}
        />

        <Kaede
          style={styles.kaede}
          label={'Donation Amount'}
          placeholder={'$'}
          labelStyle={styles.label}
          inputStyle={styles.input}
          keyboardType={'number-pad'}
          onChangeText={cashDonation => {
            let dish = this.state.dish;
            dish.cashDonation = cashDonation;
            this.setState({ dish }, () => console.log(this.state.dish));
          }}
          value={this.state.dish.cashDonation}
        />

        <Kaede
          style={styles.kaede}
          label={'Donation Amount'}
          placeholder={"Quantity"}
          labelStyle={styles.label}
          inputStyle={styles.input}
          keyboardType={'number-pad'}
          onChangeText={quantity => {
            let dish = this.state.dish;
            dish.quantity = quantity;
            this.setState({ dish }, () => console.log(this.state.dish));
          }}
          value={this.state.dish.quantity}
        />
        <View style={styles.picker}>
          <Picker
            supportedOrientations={["portrait", "landscape"]}
            iosHeader="Select one"
            mode="dropdown"
            selectedValue={this.state.selected1}
            onValueChange={this.onValueChange.bind(this)}
          >
            {/*<Item label="Select a Cuisine Style" value={0} />*/}
            {this.state.genres
              ? this.state.genres.map((curr, ind) => {
                  return <Item label={curr} value={ind} />;
                })
              : {}}
          </Picker>
        </View>

        <View style={styles.nextButton}>
          <Button
            rounded transparent bordered dark
            onPress={() => this.handleSubmit()}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </Button>
        </View>
        </Content>
      </Container>
    );
  }
}
