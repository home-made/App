import React, { Component } from "react";
import { Image, StyleSheet, TouchableHighlight } from "react-native";
import {
  Container,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Left,
  Body,
  Toast,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
var styles = StyleSheet.create({
  image: {
    width: 370,
    height: 250,
    borderRadius: 20,
    alignSelf: "center",
    resizeMode: "contain"
  }
});

export default class DishViewCard extends Component {
  render() {
    {
      console.log("the props inside DishViewCard are ", this.props);
    }
    return (
      <Container style={{ marginBottom: -270 }}>
        <Content>
          <Card>
            <CardItem>
              <Body>
                <Text>{this.props.dish.name}</Text>
                <Text note>{this.props.dish.description}</Text>
                <Text note>Quantity Available: {this.props.dish.quantity}</Text>
                <Image
                  style={styles.image}
                  source={{ uri: this.props.dish.dishImages[0] }}
                />
                <Icon
                  style={{alignSelf: 'flex-end'}}
                  onPress={() => {
                    this.props.addToCart(this.props.dish);
                    Toast.show({
                      supportedOrientations: ["portrait", "landscape"],
                      text: "Added to Cart!",
                      position: "center",
                      duration: 1000
                    });
                  }}
                  name="cart-plus"
                  size={30}
                />
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
