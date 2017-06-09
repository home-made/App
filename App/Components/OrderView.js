import React, { Component } from "react";
import { StyleSheet, View, Image, ScrollView } from "react-native";
import ActionButton from "react-native-circular-action-menu";
import Icon from "react-native-vector-icons/Foundation";
import Icon2 from "react-native-vector-icons/Entypo";
import Communications from "react-native-communications";
import {
  Button,
  Container,
  Text,
  Content,
  Card,
  Body,
  CardItem,
  Thumbnail

} from "native-base";
import { Grid, Row, Col } from "react-native-easy-grid";
import { Actions, ActionConst } from "react-native-router-flux";
import axios from "axios";
import moment from "moment";
export default class OrderView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleAccept = this.handleAccept.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
  }

  componentWillMount() {
    // console.log(this.props)
    let dishes = [];

    for (var key in this.props.cart) {
      dishes.push(this.props.cart[key]);
    }
    this.setState({ dishes }, () =>
      console.log("STATE.DISHES", this.state.dishes)
    );
  }

  handleAccept() {
    let request = {
      chefId: this.props.chefId,
      date: this.props.date,
      _id: this.props._id,
      status: 1
    };
    console.log("accept looks like", request);
    axios.put("http://homemadeapp.org:3000/orders", request).then(res => {
      console.log("RESPONSE IS", res.data);
      Actions.orders({ chefView:true,type: ActionConst.RESET });
    });
  }

  handleDecline() {
    let request = {
      chefId: this.props.chefId,
      date: this.props.date,
      _id: this.props._id,
      status: 3
    };
    axios
      .put("http://homemadeapp.org:3000/orders", request)
      .then(() => Actions.orders({ chefView:true,type: ActionConst.RESET }));
  }

  handleComplete() {
    console.log("INSIDE HANDLE COMPLETE");
    let request = {
      chefId: this.props.chefId,
      date: this.props.date,
      _id: this.props._id,
      status: 2
    };
    axios.put("http://homemadeapp.org:3000/orders", request).then(res => {
      console.log("COMPLETED ORDER:", res.data);
      Actions.orders({ chefView:true,type: ActionConst.RESET });
    });
  }

  render() {
    console.log("STATE IN ORDER VIEW", this.state);
    console.log("PROPS IN ORDER VIEW", this.props);
    return (
      <ScrollView>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20
      
          }}
        >
          <Image
            style={{
              width: 150,
              height: 150,
              marginTop: 100,
              marginBottom: 10,
              borderRadius: 75
            }}
            source={{
              uri: this.props.customer.profileUrl
            }}
          />
          <Text>{this.props.customer.firstName} </Text>

        </View>
        {this.props.status === 0
          ? <Row
              style={{
                justifyContent: "center",
                alignItems: "center"
              }}
            >

              {this.props.status === 0
                ? <Button onPress={this.handleDecline}>
                    <Text>Decline</Text>
                  </Button>
                : null}

              {this.props.status === 0
                ? <Button
                    style={{ marginLeft: 10 }}
                    onPress={this.handleAccept}
                  >
                    <Text>Accept</Text>
                  </Button>
                : null}

            </Row>
          : null}


            {this.props.status === 1
              ? <Button
                  style={{ alignSelf: 'center'}}
                  onPress={() => {
                    this.handleComplete();
                  }}
                >
                  <Text>Order Complete</Text>
                </Button>
              : null}

            {this.props.status === 2
              ? <Button
                  style={{ alignSelf: 'center'}}
                  onPress={() =>
                    Actions.feedback({
                      chefView: this.props.chefView,
                      chefId: this.props.chefId,
                      customerId: this.props.customerId,
                      date: this.props.date,
                      _id: this.props._id
                    })}
                >
                  <Text>Leave Feedback</Text>
                </Button>
              : null}
            <Button
              style={{ marginVertical: 10, alignSelf: 'center' }}
              onPress={() => {
                Actions.userProfile({ profile: this.props.customer });
              }}
            >
              <Text>Customer Profile</Text>
            </Button>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {this.props.status === 1
                ? <View
                    style={{
                      flex: 1,
                      marginTop: 50,
                      marginRight: -225,
                      marginBottom: 15
                    }}
                  >
                    <ActionButton
                      style={{}}
                      icon={
                        <Icon
                          name="telephone"
                          size={30}
                          style={{ alignItems: "center", color: "white" }}
                        />
                      }
                      buttonColor="#02E550"
                      onPress={() =>
                        Communications.phonecall(this.props.customer.phoneNumber, true)
                      }
                    />

                  </View>
                : null}

              {this.props.status === 1
                ? <View style={{ flex: 1, marginTop: 50, marginBottom: 15 }}>
                    <ActionButton
                      style={{}}
                      icon={
                        <Icon2
                          name="message"
                          size={30}
                          style={{ alignItems: "center", color: "white" }}
                        />
                        }
                      onPress={() =>
                        Communications.text(this.props.customer.phoneNumber)
                      }
                      buttonColor="#02E550"
                    />
                  </View>
                : null}
            </View>

          <View style={{marginTop: 20, alignItems: "center"}}>
            
            <Text>Placed at: {moment(this.props.date).format("LLLL")}</Text>
            <Text>Special Requests: {this.props.orderInstructions ? this.props.orderInstructions : 'No special instructions.'}</Text>
          </View>

        {this.props.status !== 2
          ? this.state.dishes.map(dish => {
              return (
                <Card style={{ marginTop: 20, marginLeft: 10, marginRight: 10 }}>
                  <CardItem>
                    
                      <Thumbnail square large style={{marginRight: 10}} source={{ uri: dish.dish.dishImages[0] }} />
                      <Body>      
                      <Text>
                        {dish.dish.name}
                      </Text>
   
                      <Text note>
                        Quantity: {dish.amount}
                      </Text>
                      
                    </Body>
                  </CardItem>
                </Card>
              );
            })
          : null}

      </ScrollView>
    );
  }
}
