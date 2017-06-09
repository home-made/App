import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from './Containers/App';
import createStore from './Redux/Reducers';

const store = createStore();
console.disableYellowBox = true;

export default class Main extends Component {
  render() {
    console.disableYellowBox = true;
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
