// import from vendors
import React from 'react';
import PropTypes from 'prop-types';

// import from components
import Header from '../../components/Header/Header';

// import from styles
import './PageLayout.css';

export default class PageLayout extends React.Component {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const { children } = this.props;

    return (
      <div className="page-layout">
        <Header />
        <main className="main">
          { children }
        </main>
        <footer className="footer" />
      </div>
    );
  }

}
