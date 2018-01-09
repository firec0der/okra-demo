// imports from vendors
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

// imports from middleware
import { forbidden } from './middlewares/auth';

import rootReducer from './reducers';

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
  {},
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
