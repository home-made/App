import React, { Component } from "react";
import Drawer from "react-native-drawer";
import NavBar from "./NavBar";
import { Actions, DefaultRenderer } from "react-native-router-flux";

export default class NavigationDrawer extends Component {

  componentDidMount() {
    console.log("DRAWER MOUNTED");
  }
  render() {
    const state = this.props.navigationState;
    const children = state.children;
    return (
      <Drawer
        ref="navigation"
        open={state.open}
        onOpen={() => Actions.refresh({ key: state.key, open: true })}
        onClose={() => Actions.refresh({ key: state.key, open: false })}
        type="displace"
        content={<NavBar />}
        tapToClose={true}
        openDrawerOffset={0.25}
        panCloseMask={.3}
        negotiatePan={true}
        styles={drawerStyles}
        tweenHandler={ratio => {
          return {
            mainOverlay: {
              opacity: ratio === 0 ? 0 : 0.3,
              backgroundColor: "#000"
            }
          };
        }}
      >
        <DefaultRenderer
          navigationState={children[0]}
          onNavigate={this.props.onNavigate}
        />
      </Drawer>
    );
  }
}

const drawerStyles = {
  drawer: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 1
  },
  main: { paddingLeft: 0 }
};
