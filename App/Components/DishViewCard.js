import React, { Component } from 'react';
import { Image, StyleSheet, TouchableHighlight } from 'react-native';
import { Container, Content, Card, CardItem, 
Thumbnail, Text, Button, Icon, Left, Body, Toast } from 'native-base';


var styles = StyleSheet.create({
  image: {
    flex: 1,
    width: 350,
    height: 350,
    alignSelf: 'center',
    resizeMode: 'contain'
  }
});


export default class DishViewCard extends Component {
  render() {
    {console.log("the props inside DishViewCard are ", this.props)}
    return (
      <Container>
        <Content>
          <Card style={{ resizeMode: 'contain', flex: 1 }}>
            <CardItem>
              <Left>
                <Body>
                  <Text>NativeBase</Text>
                  <Text note>April 15, 2016</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Image style={ styles.image } source={{ uri: this.props.dish.dishImages[0]}} />
              <Text>
                  //Your text here
                  
              </Text>

                <Icon onPress={() => { 
                this.props.addToCart(this.props.dish);
                Toast.show({
                  supportedOrientations: ["portrait", "landscape"],
                  text: "Added to Cart!",
                  position: "bottom",
                  duration: 1000
                }); 
              }} name="cart"></Icon>
              
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}