import React, { Component } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Row } from "react-native-easy-grid";
import { Button, Text, Container, Content, Toast } from "native-base";
export default class DishView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log(this.props);
    return (
      <View style={styles.container}>

        <Text />
        <Image
          style={{
            width: 120,
            height: 120,
            borderRadius: 60
          }}
          source={{ uri: this.props.dish.dishImages[0] }}
        />
        <Text> {this.props.dish.name}</Text>
        <Text> ${this.props.dish.cashDonation}</Text>
        <Container style={{ alignContent: "center" }}>
          <Content>
            <Button
              onPress={() => {
                this.props.addToCart(this.props.dish);
                Toast.show({
                  supportedOrientations: ["portrait", "landscape"],
                  text: "Added to Cart!",
                  position: "bottom",
                  duration: 1000
                });
              }}
            >
              <Text>Add to cart</Text>
            </Button>
          </Content>
        </Container>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: -600
  }
});
