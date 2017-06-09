import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  View
} from "react-native";
const { width, height } = Dimensions.get("window");
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
  Toast
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
var styles = StyleSheet.create({
  image: {
    width: width - 4,
    height: 250,
    alignSelf: "center"
  }
});

export default class DishViewCard extends Component {
  render() {
    return (
      <Container style={{ marginBottom: -290 }}>
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
                <View style={{ alignSelf: "flex-end", flexDirection: "row" }}>
                  <Text style={{ alignSelf: "center" }} note> Add to Cart</Text>
                  <Icon
                    style={{ alignSelf: "flex-end" }}
                    onPress={() => {
                      this.props.addToCart(this.props.dish);
                      Toast.show({
                        supportedOrientations: ["portrait", "landscape"],
                        text: "Added to Cart!",
                        position: "bottom",
                        duration: 1000
                      });
                    }}
                    name="cart-plus"
                    size={30}
                  />
                </View>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
