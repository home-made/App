import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import Animation from 'lottie-react-native';

// import anim from '../assets/ezgif.com-video-to-gif.gif';

export default class LoadingPage extends Component {
  componentDidMount() {
    setTimeout(() => Actions.homepage({ type: ActionConst.RESET }), 10000);
  }

  render() {
    const { height, width } = Dimensions.get('window');

    const styles = {
      container: {
        flex: 1,
        backgroundColor: '#000000'
      },
      image: {
        flex: 1,
        alignSelf: 'center',
        resizeMode: 'contain',
        justifyContent: 'center',
        width: 470,
        marginLeft: 30
      }
    };

    return (
      <View style={styles.container}>
        <Image source={{ uri: 'https://zippy.gfycat.com/NastyDefensiveFly.gif' }} style={styles.image} />
      </View>
    );
  }
}

