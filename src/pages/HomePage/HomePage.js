// import from vendors
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';
import _ from 'lodash/fp';

// import from components
import SearchBar from '../../components/SearchBar/SearchBar';

// import from containers
import KantarBarChart from '../../containers/KantarBarChart/KantarBarChart';

// import from styles
import './HomePage.scss';

// import from assets
import UnileverLargeLogo from '../../assets/images/UL-large-logo.png';

export default class HomePage extends React.Component {

  render() {
    const searchOnSubmit = (value) => window.alert(`It works, value: ${value}`);

    return (
      <div className='home-page'>
        <Grid className='top-content'>
          <Col xs={12} md={6} mdOffset={3}>
            <img className='unilever-logo' src={UnileverLargeLogo} />
            <SearchBar onSubmit={searchOnSubmit} />
          </Col>
        </Grid>

        <KantarBarChart />
      </div>
    );
  }

}
