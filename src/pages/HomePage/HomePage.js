// import from vendors
import React from 'react';
import { Grid, Col } from 'react-bootstrap';

// import from containers
import QueryHandler from '../../containers/QueryHandler/QueryHandler';

// import from styles
import './HomePage.css';

// import from assets
import UnileverLargeLogo from './UL-large-logo.png';

export default class HomePage extends React.Component {

  render() {
    return (
      <div className="home-page">
        <Grid className="top-content" key="top-content">
          <Col xs={12} md={6} mdOffset={3}>
            <img className="unilever-logo" src={UnileverLargeLogo} />
          </Col>
        </Grid>

        <QueryHandler key="query-handler" />
      </div>
    );
  }

}
