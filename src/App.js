// import from vendors
import React from 'react';
import { Provider } from 'react-redux';

// import from store
import store from './store';

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <div>Hello</div>
      </Provider>
    );
  }

}
