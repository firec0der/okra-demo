// imports from vendors
import React from 'react';
import { Provider } from 'react-redux';

// imports from store
import store from './store';

// imports from routes
import getRoutes from './routes';

// imports from styles
import './styles/main.css';

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        { getRoutes(store) }
      </Provider>
    );
  }

}
