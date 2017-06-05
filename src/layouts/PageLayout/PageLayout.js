import React from 'react';
import TopBar from '../../components/TopBar/TopBar';

import PropTypes from 'prop-types';
import './PageLayout.scss';

export const PageLayout = ({ children }) => (
  <div className='container text-center'>
    <TopBar />

    <h1>React Redux Starter Kit</h1>

    <div className='page-layout__viewport'>
      {children}
    </div>
  </div>
);

PageLayout.propTypes = {
  children: PropTypes.node,
};

export default PageLayout;
