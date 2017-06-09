import React, { Component } from "react";
import { View, Text, StyleSheet, Icon, Linking } from "react-native";
import { Router, Scene, Actions, ActionConst } from "react-native-router-flux";

import NavigationDrawer from "./Drawer";
import HomePage from "./HomePage";
import Cuisines from "../Components/Cuisines";
import ChefMap from "../Components/ChefMap";
import ChefList from "../Components/ChefList";
import UserProfile from "../Components/UserProfile";
import Profile from "../Components/Profile";
import Checkout from "../Components/Checkout";
import EditProfile from "../Components/EditProfile";
import OrderPanel from "../Components/OrderPanel";
import OrderView from "../Components/OrderView";
import ChefPanel from "../Components/ChefPanel";
import UserOrderPanel from "../Components/UserOrderPanel";
import ManageDish from "../Components/EditDish";
import UploadImage from "../Components/UploadImage";
import DishCreate from "../Components/DishCreate";
import DishConfirm from "../Components/DishConfirm";
import Feedback from "../Components/Feedback";
import SignaturePage from "../Components/SignaturePage";
import ChefForm from "./ChefForm";
import socket from "../Socket/Socket";
import GeoPoint from "geopoint";
import axios from "axios";

// const cstore = store();
let distanceInterval;

export default class App extends Component {
  constructor() {
    super();
    this.state = {};
    this.setCuisineType = this.setCuisineType.bind(this);
    this.fetchChefs = this.fetchChefs.bind(this);
    this.setChef = this.setChef.bind(this);
    this.getChef = this.getChef.bind(this);
    this.fetchCart = this.fetchCart.bind(this);
    this.setCart = this.setCart.bind(this);
    this.fetchDishDetails = this.fetchDishDetails.bind(this);
    this.setDishDetails = this.setDishDetails.bind(this);
    this.getCuisineStyles = this.getCuisineStyles.bind(this);
    this.fetchUploadStatus = this.fetchUploadStatus.bind(this);
    this.setUploadStatus = this.setUploadStatus.bind(this);
    this.setChefLocationAndPhoneNumber = this.setChefLocationAndPhoneNumber.bind(
      this
    );
    this.updateLocation = this.updateLocation.bind(this);
    this.getLatAndLon = this.getLatAndLon.bind(this);
    this.sendOrderSocket = this.sendOrderSocket.bind(this);
    this.updateOrderSocket = this.updateOrderSocket.bind(this);
  }

  componentWillMount() {
    this.setLocation();
  }
  getLatAndLon() {
    return { lat: this.state.latitude, lon: this.state.longitude };
  }
  sendOrderSocket(order) {
    socket.emit("newOrderRequest", order);
  }
  updateOrderSocket(order) {
    socket.emit("newOrderUpdate", order);
  }
  setLocation() {
    navigator.geolocation.getCurrentPosition(
      position => {
        geo = new GeoPoint(position.coords.latitude, position.coords.longitude);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          geo
        });
      },
      error => alert(JSON.stringify(error)),
      { enableHighAccuracy: true }
    );
  }

  setChefLocationAndPhoneNumber(chef, phone) {
    const url = `http://maps.apple.com/?saddr=${this.state.latitude},${this.state.longitude}&daddr=${chef.geo_lat},${chef.geo_lng}&dirflg=d`;
    chefLocation = new GeoPoint(chef.geo_lat, chef.geo_lng);
    this.setState({ chefLocation, phone: phone });
    distanceInterval = setInterval(this.updateLocation, 2500);
    Linking.openURL(url);
  }

  updateLocation() {
    if (this.state.chefLocation.distanceTo(this.state.geo) > 2.5) {
      this.setLocation();
    } else {
      axios.post("http://homemadeapp.org:3000/text/", {
        phone: this.state.phone
      });
      clearInterval(distanceInterval);
    }
  }

  getCuisineStyles() {
    return "American,Barbecue,Burgers,Chinese,Indian,Italian,Japanese,Korean,Mediterranean,Mexican,Pizza,Sandwiches,Sushi,Thai,Vegetarian,Vietnamese,Ethiopian,Other".split(
      ","
    );
  }

  setChef(chef) {
    axios
      .get(`http://homemadeapp.org:3000/chef/${chef.authId}`)
      .then(res => {
        this.setState({ user: res.data }, () => {
          Actions.profile();
        });
      })
      .catch(err => console.log(err));
  }

  getChef() {
    return this.state.user;
  }

  setCuisineType(genre) {
    this.setState({ cuisineType: genre }, () => {
      let url = `http://homemadeapp.org:3000/chef/style/${this.state.cuisineType}`;

      let config = {
        headers: { lat: this.state.latitude, lon: this.state.longitude }
      };
      axios
        .get(url, config)
        .then(res => {
          this.setState({ chefs: res.data }, () => {
            Actions.chefList();
          });
        })
        .catch(err => {
          console.log("ERROR IS", err);
        });
    });
  }
  setUploadStatus(cameraMode) {
    this.setState({ cameraMode });
  }
  fetchUploadStatus() {
    return this.state.cameraMode;
  }
  fetchDishDetails() {
    return this.state.dish;
  }
  setDishDetails(dish) {
    this.setState({ dish });
  }
  fetchChefs() {
    return this.state.chefs;
  }
  setCart(cart) {
    this.setState({ checkout: cart });
  }
  fetchCart() {
    return this.state.checkout;
  }

  render() {
    console.disableYellowBox = true;

    const scenes = Actions.create(
      <Scene key="root">
        <Scene
          key="homepage"
          component={HomePage}
          direction="vertical"
          initial
        />
        <Scene key="chefform" component={ChefForm} />
        <Scene
          key="drawer"
          type={ActionConst.RESET}
          component={NavigationDrawer}
          open={false}
        >
          <Scene key="main" initial>

            <Scene
              navigationBarStyle={styles.navbar}
              titleStyle={styles.title}
              key="cuisines"
              component={Cuisines}
              title="Cuisines"
              setCuisineType={this.setCuisineType}
              getStyles={this.getCuisineStyles}
            />
            <Scene
              navigationBarStyle={styles.navbar}
              titleStyle={styles.title}
              key="dishedit"
              title="Manage Dish"
              component={ManageDish}
              fetchDish={this.fetchDishDetails}
              getStyles={this.getCuisineStyles}
            />
            <Scene
              navigationBarStyle={styles.navbar}
              titleStyle={styles.title}
              key="chefPanel"
              component={ChefPanel}
              title="Chef Panel"
              setDish={this.setDishDetails}
            />
            <Scene
              navigationBarStyle={styles.navbar}
              titleStyle={styles.title}
              key="chefList"
              component={ChefList}
              title="Chefs"
              fetchChefs={this.fetchChefs}
              setChef={this.setChef}
            />

            <Scene
              navigationBarStyle={styles.navbar}
              titleStyle={styles.title}
              title="Profile"
              key="userProfile"
              setCart={this.setCart}
              component={UserProfile}
            />

            <Scene
              navigationBarStyle={styles.navbar}
              titleStyle={styles.title}
              key="profile"
              title="Chef Profile"
              setCart={this.setCart}
              chef={this.state.user}
              component={Profile}
              getChef={this.getChef}
            />

            <Scene
              navigationBarStyle={styles.navbar}
              titleStyle={styles.title}
              title="Map"
              key="chefMap"
              component={ChefMap}
              setChef={this.setChef}
              getLocation={this.getLatAndLon}
            />

            <Scene
              navigationBarStyle={styles.navbar}
              titleStyle={styles.title}
              title="Checkout"
              key="checkout"
              component={Checkout}
              fetchCart={this.fetchCart}
              sendOrderSocket={this.sendOrderSocket}
            />
            <Scene
              navigationBarStyle={styles.navbar}
              titleStyle={styles.title}
              key="dishcreate"
              component={DishCreate}
              setCameraMode={this.setUploadStatus}
              setDish={this.setDishDetails}
              getStyles={this.getCuisineStyles}
              title="Create Dish"
            />
            <Scene
              navigationBarStyle={styles.navbar}
              titleStyle={styles.title}
              title="Confirm"
              key="dishconfirm"
              component={DishConfirm}
              setDish={this.setDishDetails}
              fetchDish={this.fetchDishDetails}
            />
            <Scene
              navigationBarStyle={styles.navbar}
              titleStyle={styles.title}
              key="uploadimage"
              component={UploadImage}
              title=""
              setDish={this.setDishDetails}
              fetchDish={this.fetchDishDetails}
              fetchCameraMode={this.fetchUploadStatus}
            />
            <Scene
              navigationBarStyle={styles.navbar}
              titleStyle={styles.title}
              title="Edit Profile"
              key="edit"
              component={EditProfile}
              setCameraMode={this.setUploadStatus}
            />

            <Scene
              navigationBarStyle={styles.navbar}
              titleStyle={styles.title}
              title="Orders"
              key="orders"
              component={OrderPanel}
              updateOrderSocket={this.updateOrderSocket}
            />
            <Scene
              navigationBarStyle={styles.navbar}
              titleStyle={styles.title}
              key="orderView"
              component={OrderView}
              title="Order"
            />
            <Scene
              navigationBarStyle={styles.navbar}
              titleStyle={styles.title}
              key="userOrders"
              component={UserOrderPanel}
              title="Orders"
              getChef={this.getChef}
              setChefLocationAndPhoneNumber={this.setChefLocationAndPhoneNumber}
            />
            <Scene
              navigationBarStyle={styles.navbar}
              titleStyle={styles.title}
              key="feedback"
              component={Feedback}
              title="Feedback"
            />
            <Scene
              navigationBarStyle={styles.navbar}
              titleStyle={styles.title}
              key="signature"
              component={SignaturePage}
              title="Signature"
              showAlert={this.showAlert}
            />
            <Scene key="chefform" component={ChefForm} />
          </Scene>
        </Scene>
      </Scene>
    );
    return <Router scenes={scenes} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50"
  },
  navbar: {
    backgroundColor: "#9DDDE0",
    opacity: 0.8
  },
  title: {
    fontFamily: "MarkerFelt-Thin",
    fontSize: 23,
    fontWeight: "bold",
    color: "#505050"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  }
});
