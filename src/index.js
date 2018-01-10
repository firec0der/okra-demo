// imports from vendors
import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';

// imports from styles

import App from './App';

const root = document.getElementById('root');

ReactDOM.render(<App />, root);

if (module.hot) {
  module.hot.accept('./App', () => {
    ReactDOM.render(<App />, root);
  });
}
