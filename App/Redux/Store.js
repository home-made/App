import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

export default (rootReducer, rootSaga) => {
  let plugins = [
    ...plugins,
    logger
  ]

  const sagaMiddleware = createSagaMiddleware();
  plugins.push(sagaMiddleware);

  const middleware = applyMiddleware(...plugins);

  const store = createStore(rootReducer, middleware);
  sagaMiddleware.run(rootSaga);

  return store;

}