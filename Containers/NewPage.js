import React, { Component } from 'react';
import { ActivityIndicator, RefreshControl, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';


export default class NewPage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      firstName: '',
      bio: '',
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3000/chef/7564fjasdif')
      .then((res) => {
        console.log('res.data: ', res.data);
        this.setState({
          firstName: res.data[0][0].firstName,
          bio: res.data[0][0].bio,
        })
      })
  }
  
  render() {
    console.log(this.props)
    return (
      <View style={styles.container}>
        <Text>{this.state.firstName}</Text>
        <Text>{this.state.bio}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

