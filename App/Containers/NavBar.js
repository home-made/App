import React, { Component } from "react";
import SocketIO from "socket.io-client";
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
import { Actions, ActionConst } from "react-native-router-flux";
// import { Switch } from "react-native-switch";
import axios from "axios";

export default class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chefStatus: null,
      chefView: false,
      orderNotification: 0
    };
    this.orders = this.orders.bind(this);
  }

  componentWillMount() {
    socket = new SocketIO('http://localhost:3000') 
    socket.connect()
    socket.on('init', (splash)=>{
      console.log(splash)
    })
    socket.on('message',(message)=>{
      let counter = this.state.orderNotification
      counter++
      console.log(counter)
      this.setState({orderNotification: counter},()=> console.log('new order', this.state.orderNotification))
    })
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
    getUserAuthId()
      .then(() => {
        console.log(authId);
        axios.get(`http://localhost:3000/user/${authId}`)
          .then((res) => {
            console.log(res.data)
            this.setState({
              chefStatus: res.data[0].isChef
            },()=>{
              if(this.state.chefStatus){
                socket.emit('newchef',res.data)
              }
            })
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

  statistics() {
    Actions.statistics({ type: ActionConst.RESET });
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
    console.log("CHEFVIEW IS", this.state.chefView);
    if (this.state.chefView) {
      Actions.orders({ type: ActionConst.RESET });
    } else {
      Actions.userOrders({ type: ActionConst.RESET });
    }
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
      .get("https://stzy.auth0.com/v2/logout?federated")
      .then(res => console.log(res));

    setTimeout(() => Actions.refresh({ key: "drawer", open: false }), 0);
  }

  toggleChefMode() {
         Actions.orders({ type: ActionConst.RESET });
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
        fontSize: 18
      }
    };

    return (
      <Container>

        <Image
          source={require("./img/turquoise-top-gradient-background.jpg")}
          style={styles.backgroundImage}
        />

        <View
          style={{
            marginTop: 25,
            flex: 0.08,
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 25 }}>HOMEMADE</Text>
        </View>

        <Content>

          <ListItem icon onPress={this.cuisines} style={styles.content}>
            <Left>
              <Icon name="ios-pizza" />
            </Left>
            <Body>
              <Text style={styles.entries}>Cuisines</Text>
            </Body>
          </ListItem>

          <ListItem icon onPress={this.profile} style={styles.content}>
            <Left>
              <Icon name="ios-contact" />
            </Left>
            <Body>
              <Text style={styles.entries}>Profile</Text>
            </Body>
          </ListItem>

          <ListItem icon onPress={this.statistics} style={styles.content}>
            <Left>
              <Icon name="ios-stats" />
            </Left>
            <Body>
              <Text style={styles.entries}>Statistics</Text>
            </Body>
          </ListItem>

          <ListItem icon onPress={this.chefMap} style={styles.content}>
            <Left>
              <Icon name="ios-map" />
            </Left>
            <Body>
              <Text style={styles.entries}>Map</Text>
            </Body>
          </ListItem>

          <ListItem icon onPress={this.dishcreate} style={styles.content}>
            <Left>
              <Icon name="ios-camera" />
            </Left>
            <Body>
              <Text style={styles.entries}>Create Dish</Text>
            </Body>
          </ListItem>

          <ListItem icon onPress={this.chefPanel} style={styles.content}>
            <Left>
              <Icon name="ios-clipboard" />
            </Left>
            <Body>
              <Text style={styles.entries}>Manage Dishes</Text>
            </Body>
          </ListItem>

          <ListItem icon onPress={this.edit} style={styles.content}>
            <Left>
              <Icon name="ios-create" />
            </Left>
            <Body>
              <Text style={styles.entries}>Edit Profile</Text>
            </Body>
          </ListItem>
          <ListItem icon onPress={() => {
            this.orders
            }} style={styles.content}>
            <Left>
              <Icon name="ios-filing" />
            </Left>
            <Body>
              <Text style={styles.entries}>Orders</Text>
            </Body>
            <Right>
              {this.state.orderNotification>0? <Text note> {this.state.orderNotification}</Text> :null}
            </Right>
          </ListItem>
          {!this.state.chefStatus
            ? <ListItem icon onPress={this.chefform} style={styles.content}>
                <Left>
                  <Icon name="ios-star" />
                </Left>
                <Body>
                  <Text style={styles.entries}>Be A Chef!</Text>
                </Body>
              </ListItem>
            : null}


          <ListItem icon onPress={this.logout} style={styles.content}>
            <Left>
              <Icon name="ios-exit" />
            </Left>
            <Body>
              <Text style={styles.entries}>Log Out</Text>
            </Body>
          </ListItem>

          {this.state.chefStatus
            ? <ListItem avatar style={{ marginTop: 10 }}>
                <Switch
                  onValueChange={value => {
                    this.setState({ chefView: value }, () => {
                      if (this.state.chefView) {
                        this.toggleChefMode()
                      }
                    });
                  }}
                  value={this.state.chefView}
                  style={{ marginRight: 10 }}
                />

                <Text>Chef Mode</Text>
              </ListItem>
            : null}
        </Content>
      </Container>
    );
  }
}
