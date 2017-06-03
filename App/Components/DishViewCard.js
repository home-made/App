import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Container, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
export default class DishViewCard extends Component {
    
    render() {
      console.log("the props are ", this.props)
      return (
        <Container style={styles.container}>
          <Content>
            <Card>
                <CardItem>
                    <Left>
                        <Body>
                            <Text>NativeBase</Text>
                            <Text note>GeekyAnts</Text>
                        </Body>
                    </Left>
                  </CardItem>

                  <CardItem cardBody>
                      <Image
                        style={{
                          width: 200,
                          height: 200,
                        }}
                        
                        source={{ uri: this.props.dish.dishImages[0] }}
                      />
                  </CardItem>


                  
            </Card>
          </Content>
        </Container>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  }
});