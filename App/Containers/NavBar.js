import React, { Component } from "react";
import { Image, View, StyleSheet, AsyncStorage, Switch } from "react-native";
import {
  Container,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Body,
  Left,
  Right,
  Icon
} from "native-base";
import Icon2 from "react-native-vector-icons/Ionicons";
import { Actions, ActionConst } from "react-native-router-flux";
import socket from '../Socket/Socket'
import AnimatedLinearGradient, {presetColors} from 'react-native-animated-linear-gradient';
// import { Switch } from "react-native-switch";

import axios from "axios";

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chefStatus: null,
      chefView: false,

    };
    this.orders = this.orders.bind(this);
  }
  addChefNotification(){
    let counter = this.state.chefNotification
    counter++
    console.log(counter)
    this.setState({chefNotification: counter},()=> console.log('new chef order notification', this.state.chefNotification))
  }
  addCustomerNotification(){
    let counter = this.state.customerNotification
    counter++
    console.log(counter)
    this.setState({customerNotification: counter},()=> console.log('new customer order notification', this.state.customerNotification))
  }
  clearCustomerNotification(){
    this.setState({customerNotification:0})
  }
  clearChefNotification(){
    this.setState({chefNotification:0})
  }
  componentWillMount() {
    this.clearChefNotification();
    this.clearCustomerNotification();
    let authId;
    async function getUserAuthId() {
      try {
        const data = await AsyncStorage.getItem("profile");
        if (data !== null && data !== undefined) {
          console.log("profile in componentwillmount: ", JSON.parse(data));
          authId = JSON.parse(data).userId;
        }
      } catch (err) {
        console.log("Error getting data: ", err);
      }
    }
    getUserAuthId().then(() => {
      console.log(authId);

      axios.get(`http://localhost:3000/user/${authId}`).then(res => {

        let chefRoom = 'chef'+res.data[0].authId;
        socket.on(chefRoom, splash => {
          this.addChefNotification()
        });
        let customerRoom = 'customer'+res.data[0].authId;
        socket.on(customerRoom, splash => {
          this.addCustomerNotification()
        });
        console.log(res.data);
        this.setState(
          {
            chefStatus: res.data[0].isChef
          },
          () => {
            if (this.state.chefStatus) {
              socket.emit("newchef", res.data);
            }
          }
        );
      });
    });
  }

  cuisines() {
    Actions.cuisines({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  chefList() {
    Actions.chefList({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  dishcreate() {
    Actions.dishcreate({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  profile() {
    Actions.userProfile({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  chefMap() {
    Actions.chefMap({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  checkout() {
    Actions.checkout({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  chefPanel() {
    Actions.chefPanel({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  edit() {
    Actions.edit({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  orders() {
    console.log("clicked");
    console.log("CHEFVIEW IS", this.state.chefView);

      Actions.orders({ chefView: this.state.chefView, type: ActionConst.RESET });

    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  currentOrder() {
    Actions.userOrders({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  signature() {
    Actions.signature({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  chefform() {
    Actions.chefform({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  logout() {
    Actions.homepage({ type: ActionConst.RESET });
    async function clearStorage() {
      try {
        await AsyncStorage.multiRemove(
          ["profile", "token", "isAuthenticated"],
          () => {
            console.log("Storage cleared!");
          }
        );
      } catch (err) {
        console.log("Error clearing storage: ", err);
      }
    }
    clearStorage();
    axios
      .get("http://stzy.auth0.com/v2/logout?federated")
      .then(res => console.log(res));

    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  toggleChefMode() {
    //  Actions.orders({ type: ActionConst.RESET });
    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  render() {
    const styles = {
      content: {
        marginTop: 6,
        justifyContent: "center",
        alignItems: "center"
      },
      backgroundImage: {
        position: "absolute",
        resizeMode: "cover"
      },
      entries: {
        fontSize: 18,
        color: '#E05050',
        fontFamily: 'Noteworthy-Bold'
      },
      icons: {
        color: '#E05050'
      }
    };

    const colorScheme = {
      homemade: [
        '#9EECF0',
        '#9EF0EA',
        '#9EF0DA',
        '#9EF0CE',
        '#9EF0B6',
        '#9EF0A0',
        '#B2F09E',
        '#D6F09E'
      ]
    }

    return (
      <Container>
        <AnimatedLinearGradient customColors={colorScheme.homemade} speed={1000}/>

        <View
          style={{
            marginTop: 25,
            flex: 0.08,
            justifyContent: "center",
            flexDirection: "column",
            backgroundColor: 'rgba(0,0,0,0)'
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: '#E05050',
              fontFamily: 'MarkerFelt-Wide',
              fontSize: 40
            }}>
              Homemade
          </Text>
        </View>

        <Content>
          <ListItem icon onPress={this.cuisines} style={styles.content}>
            <Left>
              <Icon style={styles.icons} name="ios-pizza" />
            </Left>
            <Body>
              <Text style={styles.entries}>Cuisines</Text>
            </Body>
          </ListItem>

          <ListItem icon onPress={this.profile} style={styles.content}>
            <Left>
              <Icon style={styles.icons} name="ios-contact" />
            </Left>
            <Body>
              <Text style={styles.entries}>Profile</Text>
            </Body>
          </ListItem>

          <ListItem icon onPress={this.chefMap} style={styles.content}>
            <Left>
              <Icon style={styles.icons} name="ios-map" />
            </Left>
            <Body>
              <Text style={styles.entries}>Map</Text>
            </Body>
          </ListItem>

          {this.state.chefView
            ? <ListItem icon onPress={this.dishcreate} style={styles.content}>
                <Left>
                  <Icon style={styles.icons} name="ios-camera" />
                </Left>
                <Body>
                  <Text style={styles.entries}>Create Dish</Text>
                </Body>
              </ListItem>
            : null}

          {this.state.chefView
            ? <ListItem icon onPress={this.chefPanel} style={styles.content}>
                <Left>
                  <Icon style={styles.icons} name="ios-clipboard" />
                </Left>
                <Body>
                  <Text style={styles.entries}>Manage Dishes</Text>
                </Body>
              </ListItem>
            : null}

          <ListItem icon onPress={this.edit} style={styles.content}>
            <Left>
              <Icon style={styles.icons} name="ios-create" />
            </Left>
            <Body>
              <Text style={styles.entries}>Edit Profile</Text>
            </Body>
          </ListItem>
          {!this.state.chefView ? <ListItem
            icon
            onPress={() => {
              this.currentOrder();
              if(this.state.chefView)
                this.setState({ chefNotification: 0 });
              else
                this.setState({ customerNotification: 0 });
            }}
            style={styles.content}
          >
            <Left>
              <Icon style={styles.icons} name="ios-filing" />
            </Left>
            <Body>
             <Text style={styles.entries}>Current Order</Text>
            </Body>
            <Right>
              {this.state.chefView && this.state.chefNotification>0 ? <Icon2 size={20} name="ios-alert-outline"/> : null}
              {!this.state.chefView && this.state.customerNotification>0? <Icon2 size={20} name="ios-alert-outline"/>: null }
            </Right>
          </ListItem> : null}
          <ListItem
            icon
            onPress={() => {
              this.orders();
              if(this.state.chefView)
                this.setState({ chefNotification: 0 });
              else
                this.setState({ customerNotification: 0 });
            }}
            style={styles.content}
          >
            <Left>
              <Icon style={styles.icons} name="ios-filing" />
            </Left>
            <Body>
             <Text style={styles.entries}>Orders</Text>
            </Body>
            <Right>
              {this.state.chefView && this.state.chefNotification>0 ? <Icon2 size={20} name="ios-alert-outline"/> : null}
              {!this.state.chefView && this.state.customerNotification>0? <Icon2 size={20} name="ios-alert-outline"/>: null }
            </Right>
          </ListItem>

          {!this.state.chefStatus
            ? <ListItem icon onPress={this.signature} style={styles.content}>
                <Left>
                  <Icon style={styles.icons} name="ios-star" />
                </Left>
                <Body>
                  <Text style={styles.entries}>Be A Chef!</Text>
                </Body>
              </ListItem>
            : null}

          <ListItem icon onPress={this.logout} style={styles.content}>
            <Left>
              <Icon style={styles.icons} name="ios-exit" />
            </Left>
            <Body>
              <Text style={styles.entries}>Log Out</Text>
            </Body>
          </ListItem>

          {this.state.chefStatus
            ? <ListItem avatar style={{ marginTop: 10 }}>
                <Switch
                  onValueChange={value => {
                    this.setState({ chefView: value });
                  }}
                  value={this.state.chefView}
                  style={{ marginRight: 10 }}
                />

                <Text style={styles.entries}>Chef Mode</Text>
              </ListItem>
            : null}
        </Content>
      </Container>
    );
  }
}
