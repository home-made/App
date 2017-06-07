import { combineReducers } from 'redux';
import rootSaga from '../Sagas';
import configureStore from './Store';
import login from './Duck.Login';

export default history => {
  const rootReducer = combineReducers({
    login,
  })
  return configureStore(rootReducer, rootSaga, history);
}