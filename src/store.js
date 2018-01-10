// imports from vendors
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import _ from 'lodash/fp';

// imports from middleware
import { forbidden } from './middlewares/auth';

// imports from utils
import * as localStorageDecorator from './utils/localStorage';

import rootReducer from './reducers';

const auth = localStorageDecorator.getItemAndParse('auth');

const enhancers = [];
const middleware = [thunk, forbidden];

if (process.env.NODE_ENV === 'development') {
  const { devToolsExtension } = window;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

const store = createStore(
  rootReducer,
  { auth: { isAuthenticated: !!_.getOr(null, 'token', auth) } },
  composedEnhancers
);

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers').default); // eslint-disable-line global-require
    });
  }
}

export default store;
