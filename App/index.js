import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from './Containers/App';
import createStore from './Redux/Reducers';

const store = createStore();

export default class Main extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
