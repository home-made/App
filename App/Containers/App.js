import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Router, Scene, Actions, ActionConst } from "react-native-router-flux";

import NavigationDrawer from "./Drawer";
import HomePage from "./HomePage";
import Cuisines from "../Components/Cuisines";
import ChefMap from "../Components/ChefMap";
import ChefList from "../Components/ChefList";
import Profile from "../Components/Profile";
import Checkout from "../Components/Checkout";
import EditProfile from "../Components/EditProfile";
import OrderPanel from "../Components/OrderPanel";
import OrderView from "../Components/OrderView";
import ChefPanel from "../Components/ChefPanel";
import UploadImageDish from "../Components/UploadImageDish";
import DishCreate from "../Components/DishCreate";
import DishConfirm from "../Components/DishConfirm";
import UserOrderPanel from "../Components/UserOrderPanel";
import axios from "axios";

// const cstore = store();

// var socketConfig = { path: '/socket'};
class App extends Component {
  constructor() {
    super();
    this.state = {};
    this.setCuisineType = this.setCuisineType.bind(this);
    this.fetchChefs = this.fetchChefs.bind(this);
    this.setChef = this.setChef.bind(this);
    this.getChef = this.getChef.bind(this);
    this.fetchCart = this.fetchCart.bind(this);
    this.setCart = this.setCart.bind(this);
    this.fetchDishDetails = this.fetchDishDetails.bind(this)
    this.setDishDetails = this.setDishDetails.bind(this)
    this.getCuisineStyles = this.getCuisineStyles.bind(this)

  }

  componentDidMount() {
    console.log("APP MOUNTED");
  }
  getCuisineStyles(){
    return "All Cuisines,American,Barbecue,Burgers,Chinese,Indian,Italian,Japanese,Korean,Mediterranean,Mexican,Pizza,Sandwiches,Sushi,Thai,Vegetarian,Vietnamese,American,Ethiopian,Other".split(",");
  }
  setChef(chef) {
    axios.get(`http://localhost:3000/chef/${chef.authId}`).then( res => {
      this.setState({user: res.data}, () => {
        Actions.profile();});
    })
  }

  getChef() {
    return this.state.user;
  }

  setCuisineType(genre) {
    console.log(genre);
    this.setState({cuisineType: genre}, () => {
      let url = `http://localhost:3000/chef/style/${this.state.cuisineType}`;
      axios
        .get(url)
        .then(res => {
          console.log("res.data inside App.js for setCuisine is ", res.data)
          this.setState({ chefs: res.data }, () => {
            Actions.chefList({ type: ActionConst.RESET });
          })
        })
        .catch(err => {
          console.log("ERROR IS", err);
        });
    });
  }
  fetchDishDetails() {
    console.log('dish set',this.state.dish)
    return this.state.dish;
  }
  setDishDetails(dish) {
    this.setState({dish},()=> console.log('dish set',this.state.dish));
  }
  fetchChefs() {
    console.log("the chefs inside fetchchefs are ", this.state.chefs)
    return this.state.chefs;
  }
  setCart(cart) {
    this.setState({ checkout: cart });
  }
  fetchCart() {
    return this.state.checkout;
  }

  render() {
    const scenes = Actions.create(
      <Scene key="root">
        <Scene
          key="homepage"
          component={HomePage}
          direction="vertical"
          style={styles.navbar}
          initial
        />
        <Scene
          key="drawer"
          type={ActionConst.RESET}
          component={NavigationDrawer}
          open={false}
        >
          <Scene key="main" initial>


            <Scene
              key="cuisines"
              component={Cuisines}
              title="Cuisines"
              setCuisineType={this.setCuisineType}
            />
            <Scene key="chefPanel" component={ChefPanel} title="Chef Panel" />
            <Scene
              key="chefList"
              component={ChefList}
              title="Chefs"
              fetchChefs={this.fetchChefs}
              setChef={this.setChef}
            />
            <Scene
              key="profile"
              setCart={this.setCart}
              chef={this.state.user}
              component={Profile}
              getChef={this.getChef}
            />

            <Scene key="chefMap" component={ChefMap} setChef={this.setChef} />

            <Scene
              key="checkout"
              component={Checkout}
              fetchCart={this.fetchCart}
            />
            <Scene key="dishcreate" component={DishCreate} setDish={this.setDishDetails} getStyles={this.getCuisineStyles}
              title="Create Dish"/>
            <Scene key="dishconfirm" component={DishConfirm} setDish={this.setDishDetails}  fetchDish={this.fetchDishDetails}/>
            <Scene
              key="uploaddishimage"
              component={UploadImageDish}
              title="Upload Dish"
            />
            <Scene key="edit" component={EditProfile} />
            <Scene key="orders" component={OrderPanel} />
            <Scene key="orderView" component={OrderView} title="Order" />
            <Scene key="userOrders" component={UserOrderPanel} title="Orders" />

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
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  }
});

export default App;
