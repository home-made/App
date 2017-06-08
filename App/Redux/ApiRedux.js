// require('dotenv').load();
import { Platform } from 'react-native';

const API = 'http://localhost:3000';

// MIDDLEWARE

export const apiMiddleware = store => next => action => {
  // Pass all actions through by default
  next(action);
  switch (action.type) {
    // In case we receive an action to send an API request
    case 'GET_CHEF_INFO':
      // Dispatch GET_CHEF_DATA_LOADING to update loading state
      store.dispatch({type: 'GET_CHEF_DATA_LOADING'});
      // Make API call and dispatch appropriate actions when done
      fetch(`${API}/chef/7564fjasdif`)
        .then(response => response.json())
        .then(data => next({
          type: 'GET_CHEF_DATA_RECEIVED',
          data
        }))
        .catch(error => next({
          type: 'GET_CHEF_DATA_ERROR',
          error
        }));
      break;
    // Do nothing if the action does not interest us
    default:
      break;
  }
};

// REDUCER

export const reducer = (state = { chef: [], loading: true }, action) => {
  switch (action.type) {
    case 'GET_CHEF_DATA_LOADING':
      return {
        ...state,                   // keep the existing state,
        loading: true,              // but change loading to true
      };
    case 'GET_CHEF_DATA_RECEIVED':
      return {
        loading: false,             // set loading to false
        chef: action.data.chef, // update chef array with reponse data
      };
    case 'GET_CHEF_DATA_ERROR':
      return state;
    default:
      return state;
    }
};
