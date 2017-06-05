// import from vendors
import React from 'react';
import PropTypes from 'prop-types';

// import from components
import TopBar from '../../components/TopBar/TopBar';

// import from styles
import './PageLayout.scss';

export default class PageLayout extends React.Component {

  static propTypes = {
    children: PropTypes.node
  }

  render() {
    const { children } = this.props;

    return (
      <div className='container text-center'>
        <TopBar />

        <div className='page-layout__viewport'>
          { children }
        </div>
      </div>
    );
  }

}
