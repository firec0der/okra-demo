// imports from vendors
import React from 'react';
import { Provider } from 'react-redux';

// imports from layouts
import PageLayout from './layouts/PageLayout/PageLayout';

// imports from store
import store from './store';

// imports from styles
import './styles/main.css';

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <PageLayout>
          <div>Hello</div>
        </PageLayout>
      </Provider>
    );
  }

}
